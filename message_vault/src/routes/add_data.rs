use crate::{AppState, Message};
use axum::{Json, extract::State, http::StatusCode};
use chrono::Utc;
use serde::{Deserialize, Serialize};
// Assuming these are your structs
#[derive(Debug, Clone, Deserialize, Serialize)]
pub struct MessageData {
    message_id: String,
    username: String,
    sender_username: String,
    receiver_username: String, // Fixed spelling: reciber → receiver
    content: String,
    content_type: String,
    time_stamp: String,
    sender_type: String,
    read: bool,
}

pub async fn add_data(
    State(state): State<AppState>,
    Json(data): Json<MessageData>, // MessageData should be defined
) -> StatusCode {
    let mut guard = state.data.lock().await;

    let conversation_id = format!("{}", &data.username);

    // Create Message from MessageData
    let new_message = Message {
        message_id: data.message_id,
        username: data.username,
        sender_username: data.sender_username,
        receiver_username: data.receiver_username,
        content: data.content,
        content_type: data.content_type,
        time_stamp: data.time_stamp,
        read: data.read,
        sender_type: data.sender_type,
        server_time: Utc::now(), // Set current server time
    };

    // Check if conversation already exists

    // Entry API use karo - efficient hai!
    guard
        .entry(conversation_id)
        .or_insert_with(Vec::new) // Agar nahi hai toh naya vector banayo
        .push(new_message); // Message push karo

    return StatusCode::OK;
}
