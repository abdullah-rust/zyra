use axum::{
    Router,
    extract::State,
    routing::{get, post},
};
use chrono::{DateTime as ChronoDateTime, Duration as ChronoDuration, Utc};
use mongodb::Client;
use serde::{Deserialize, Serialize};
use std::{collections::HashMap, sync::Arc};
use tokio::sync::Mutex;
use tokio::time::{Duration, sleep};
mod client;
mod routes;

#[derive(Debug, Clone, Deserialize, Serialize)]
pub struct Message {
    pub message_id: String,
    pub username: String,
    pub sender_username: String,
    pub receiver_username: String,
    pub content: String,
    pub content_type: String,
    pub time_stamp: String,
    pub read: bool,
    pub sender_type: String,
    pub server_time: ChronoDateTime<Utc>,
}

#[derive(Debug, Clone)]
pub struct AppState {
    pub data: Arc<Mutex<HashMap<String, Vec<Message>>>>,
    db: Client,
}

#[tokio::main]
async fn main() {
    let db = client::mongodb::get_mongo_client().await.unwrap();
    let data: Arc<Mutex<HashMap<String, Vec<Message>>>> = Arc::new(Mutex::new(HashMap::new()));

    let state = AppState { data, db };

    tokio::spawn(background_worker(state.clone()));
    let app = Router::new()
        .route("/", get(root))
        .route("/add", post(routes::add_data::add_data))
        .with_state(state);

    let listener = tokio::net::TcpListener::bind("0.0.0.0:4003").await.unwrap();
    println!("🚀 Server running on 0.0.0.0:4003");
    axum::serve(listener, app).await.unwrap();
}

async fn root(State(state): State<AppState>) -> &'static str {
    // State access example
    println!("Database connected: {}", state.db.database("admin").name());
    "Hello, From MessageVault"
}

async fn background_worker(state: AppState) {
    let db = state.db;
    loop {
        {
            let mut data = state.data.lock().await;
            let now = Utc::now();

            let mut expired_keys = Vec::new();

            for (key, messages) in data.iter() {
                if let Some(first_msg) = messages.first() {
                    let age = now.signed_duration_since(first_msg.server_time);
                    if age >= ChronoDuration::minutes(3) {
                        println!("⏰ Key `{}` expired ({} messages)", key, messages.len());

                        let coll = db
                            .database("zyradb") // apni DB ka naam
                            .collection::<Message>(&first_msg.username);

                        // ✅ Ab yahan sirf ek baar insert_many call karen
                        if let Err(e) = coll.insert_many(messages.clone()).await {
                            eprintln!("❌ InsertMany error for {}: {}", first_msg.username, e);
                        }

                        expired_keys.push(key.clone());
                    }
                }
            }

            for key in expired_keys {
                data.remove(&key);
            }
        }

        sleep(Duration::from_secs(5)).await;
    }
}
