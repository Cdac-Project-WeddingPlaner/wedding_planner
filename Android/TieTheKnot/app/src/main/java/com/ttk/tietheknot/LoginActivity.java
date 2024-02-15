package com.ttk.tietheknot;

import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.util.Log;
import android.widget.Button;
import android.widget.EditText;
import android.widget.TextView;

import androidx.appcompat.app.AppCompatActivity;

import com.google.gson.JsonObject;
import com.ttk.tietheknot.API.ApiManager;

public class LoginActivity extends AppCompatActivity implements ApiManager.OnApiCallCompleteListener<JsonObject> {

    private ApiManager apiManager;
    private SharedPreferences preferences;

    private EditText emailEditText;
    private EditText passwordEditText;
    private Button loginButton;
    private Button registerButton;
    private TextView responseTextView;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_login);

        apiManager = new ApiManager();
        preferences = getSharedPreferences("LoginPreferences", MODE_PRIVATE);

        emailEditText = findViewById(R.id.emailEditText);
        passwordEditText = findViewById(R.id.passwordEditText);
        loginButton = findViewById(R.id.loginButton);
        registerButton = findViewById(R.id.registerButton);
        responseTextView = findViewById(R.id.responseTextView);

        loginButton.setOnClickListener(v -> {
            String email = emailEditText.getText().toString();
            String password = passwordEditText.getText().toString();
            apiManager.login(email, password, this);
        });

        registerButton.setOnClickListener(v -> {
            // Navigate to the registration activity
            startActivity(new Intent(LoginActivity.this, UserRegisterActivity.class));
        });
    }

    @Override
    public void onSuccess(JsonObject data) {
        // Handle successful response (data contains login details)
        // Update UI or perform further actions

        // Store the response data (for example, in SharedPreferences)
        storeLoginResponseData(data);

        // Print the response data to the log
        printLoginResponseToLog(data);

        // Display the response data in the UI
        displayResponseInUI(data);
    }

    @Override
    public void onFailure(String errorMessage) {
        // Handle failure (print error message, show an alert, etc.)
        responseTextView.setText("Login failed: " + errorMessage);
    }

    private void storeLoginResponseData(JsonObject data) {
        // Implement logic to store the response data
        // For example, you can use SharedPreferences
        SharedPreferences.Editor editor = preferences.edit();
        editor.putString("user_id", data.get("user_id").getAsString());
        editor.putString("first_name", data.get("first_name").getAsString());
        // Add other necessary data
        editor.apply();
    }

    private void printLoginResponseToLog(JsonObject data) {
        // Log the response data
        Log.d("LoginResponse", "User ID: " + data.get("user_id").getAsString());
        Log.d("LoginResponse", "First Name: " + data.get("first_name").getAsString());
        // Print other necessary data to the log
    }

    private void displayResponseInUI(JsonObject data) {
        // Display the response data in the UI (assuming you have a TextView with id responseTextView)
        responseTextView.setText("User ID: " + data.get("user_id").getAsString() + "\n"
                + "First Name: " + data.get("first_name").getAsString());
        // Update UI as needed
    }
}
