package com.ttk.tietheknot;

import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.util.Log;
import android.widget.Button;
import android.widget.EditText;
import android.widget.TextView;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;

import com.google.gson.JsonObject;
import com.ttk.tietheknot.API.ApiManager;
import com.ttk.tietheknot.admin.AdminActivity;
import com.ttk.tietheknot.client.ClientActivity;
import com.ttk.tietheknot.vendor.VendorActivity;

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

        // Display the response data in the UI
        displayResponseInUI(data);

        showToast("Login successful!");

        // Redirect based on user_type
        redirectToActivity(data.get("user_type").getAsString());
    }

    @Override
    public void onFailure(String errorMessage) {
        // Handle failure (print error message, show an alert, etc.)
        responseTextView.setText("Login failed: " + errorMessage);
        showToast(errorMessage);
    }

    private void storeLoginResponseData(JsonObject data) {
        // Implement logic to store the response data
        // For example, you can use SharedPreferences
        SharedPreferences.Editor editor = preferences.edit();
        editor.putString("user_id", data.get("user_id").getAsString());
        editor.putString("role", data.get("user_type").getAsString());
        editor.putString("first_name", data.get("first_name").getAsString());
        Log.e("sdzfxc", data.toString());
       editor.putString("token", data.get("token").getAsString());


        // Add other necessary data
        editor.apply();
    }

    private void redirectToActivity(String userType) {
        Log.d("RedirectActivity", "User Type: " + userType);

        Intent intent;

        switch (userType) {
            case "admin":
                Log.e("RedirectActivity33333", "Unknown user_type: " + userType);
                intent = new Intent(LoginActivity.this, AdminActivity.class);
                break;
            case "vendor":
                Log.e("RedirectActivity2222", "Unknown user_type: " + userType);
                intent = new Intent(LoginActivity.this, VendorActivity.class);
                break;
            case "client":
                Log.e("RedirectActivity1111", "Unknown user_type: " + userType);
                intent = new Intent(LoginActivity.this, ClientActivity.class);
                break;
            default:
                Log.e("RedirectActivity", "Unknown user_type: " + userType);
                // Handle unknown user_type or fallback to a default activity
                intent = new Intent(LoginActivity.this, UserRegisterActivity.class);
                break;
        }

        Log.d("RedirectActivity", "Starting activity: " + intent.getComponent());
        startActivity(intent);

        // Finish the current LoginActivity (optional)
        finish();
    }



    private void showToast(String message) {
        // Display a Toast message
        Toast.makeText(this, message, Toast.LENGTH_SHORT).show();
    }
    private void displayResponseInUI(JsonObject data) {
        // Display the response data in the UI (assuming you have a TextView with id responseTextView)
        responseTextView.setText("User ID: " + data.get("user_id").getAsString() + "\n"
                + "user_type : " + data.get("user_type").getAsString() );
        // Update UI as needed
    }
}
