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
    pub id: String,
    pub sender_id: String,
    pub receiver_id: String,
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

            // Collect keys jo expire ho chuke hain
            let mut expired_keys = Vec::new();

            for (key, messages) in data.iter() {
                // Check first message ka server_time (ya sab ka same ho)
                if let Some(first_msg) = messages.first() {
                    let age = now.signed_duration_since(first_msg.server_time);
                    if age >= ChronoDuration::minutes(10) {
                        println!("⏰ Key `{}` expired ({} messages)", key, messages.len());
                        // Har message apne apne id ke collection me insert hoga
                        for _ in messages {
                            // ✅ Saare messages ek hi insert_many se bhejo
                            // collection ka naam messages[0].id se le rahe hain
                            let coll = db
                                .database("zyra") // apni DB ka naam
                                .collection::<Message>(&first_msg.id);

                            if let Err(e) = coll.insert_many(messages.clone()).await {
                                eprintln!("❌ InsertMany error for {}: {}", first_msg.id, e);
                            }
                        }

                        expired_keys.push(key.clone());
                    }
                }
            }

            // Expired keys delete kar do
            for key in expired_keys {
                data.remove(&key);
            }
        }

        sleep(Duration::from_secs(5)).await;
    }
}
