use anyhow::{Context, Result};
use dotenv::dotenv;
use mongodb::{
    Client,
    options::{ClientOptions, ServerApi, ServerApiVersion},
};
use std::env;

pub async fn get_mongo_client() -> Result<Client> {
    dotenv().ok();

    let uri = env::var("MONGODB_URI").context("MONGODB_URI environment variable is not set")?;

    let mut client_options = ClientOptions::parse(&uri)
        .await
        .context(format!("Failed to parse MongoDB URI: {}", uri))?;

    let server_api = ServerApi::builder().version(ServerApiVersion::V1).build();
    client_options.server_api = Some(server_api);

    client_options.app_name = Some("My Rust App".to_string());

    let client = Client::with_options(client_options).context("Failed to create MongoDB client")?;

    // ✅ Ping test
    client
        .database("admin")
        .run_command(mongodb::bson::doc! { "ping": 1 })
        .await
        .context("Failed to ping MongoDB server")?;

    // Yeh line terminal par confirm karegi
    println!("✅ Successfully connected to MongoDB!");

    Ok(client)
}
