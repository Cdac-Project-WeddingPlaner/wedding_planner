package com.ttk.tietheknot.client;

import android.annotation.SuppressLint;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.TextView;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;

import com.google.gson.JsonObject;
import com.ttk.tietheknot.API.ApiManager;
import com.ttk.tietheknot.R;
import com.ttk.tietheknot.SharedPreferencesManager;

public class ClientProfileActivity extends AppCompatActivity implements ApiManager.OnApiCallCompleteListener<JsonObject> {

    private ApiManager apiManager;
    private SharedPreferencesManager sharedPreferencesManager;

    private EditText clientNameTextView;
    private EditText clientEmailTextView;

    // Additional fields for middle_name, last_name, and address
    private EditText editTextMiddleName;
    private EditText editTextLastName;
    private EditText editTextAddress;
    private EditText editTextPhone;
    private String client_id;

    // Buttons for editing and updating
    private Button btnEdit;
    private Button btnUpdate;

    @SuppressLint("MissingInflatedId")
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_client_profile);

        apiManager = new ApiManager();
        sharedPreferencesManager = new SharedPreferencesManager(getApplicationContext());

        clientNameTextView = findViewById(R.id.editTextClientName);
        clientEmailTextView = findViewById(R.id.editTextClientEmail);

        editTextMiddleName = findViewById(R.id.editTextMiddleName);
        editTextLastName = findViewById(R.id.editTextLastName);
        editTextAddress = findViewById(R.id.editTextAddress);
        editTextPhone = findViewById(R.id.editTextPhone);

        btnEdit = findViewById(R.id.btnEdit);
        btnUpdate = findViewById(R.id.btnUpdate);

        // Set initial state of EditTexts and buttons
        setEditable(false);

        // Retrieve authentication token and user ID from SharedPreferences
        String authToken = sharedPreferencesManager.getAuthToken();
        String userId = sharedPreferencesManager.getUserId();

        if (authToken != null && userId != null) {
            // Use the ApiManager to get client data
            apiManager.getClientById(authToken, userId, this);
        } else {
            // Handle the case where either the authentication token or user ID is null
            showToast("Authentication token or user ID is null.");
        }

        // Set click listeners for Edit and Update buttons
        btnEdit.setOnClickListener(v -> setEditable(true));
        btnUpdate.setOnClickListener(v -> updateClientData());
    }

    @Override
    public void onSuccess(JsonObject data) {
        // Handle successful response (data contains client details)
        // Update UI with client information

        // Display the response data in the UI
        displayResponseInUI(data);
    }

    @Override
    public void onFailure(String errorMessage) {
        // Handle failure (print error message, show an alert, etc.)
        showToast("Failed to fetch client data: " + errorMessage);
    }

    private void displayResponseInUI(JsonObject data) {
        // Display the response data in the UI (assuming you have a TextView with id responseTextView)
        String clientName = data.getAsJsonPrimitive("first_name").getAsString();
        String clientEmail = data.getAsJsonPrimitive("email").getAsString();
        String middleName = data.getAsJsonPrimitive("middle_name").getAsString();
        String lastName = data.getAsJsonPrimitive("last_name").getAsString();
        String address = data.getAsJsonPrimitive("address").getAsString();
        String phone = data.getAsJsonPrimitive("phone_number").getAsString();
        client_id = data.getAsJsonPrimitive("client_id").getAsString();
        clientNameTextView.setText(clientName);
        clientEmailTextView.setText(clientEmail);

        // Set the additional fields for middle_name, last_name, and address
        editTextMiddleName.setText(middleName);
        editTextLastName.setText(lastName);
        editTextAddress.setText(address);
        editTextPhone.setText(phone);
    }

    private void showToast(String message) {
        // Display a Toast message
        Toast.makeText(this, message, Toast.LENGTH_SHORT).show();
    }

    private void setEditable(boolean isEditable) {
        // Enable or disable the EditTexts based on the editable state
        editTextMiddleName.setEnabled(isEditable);
        editTextLastName.setEnabled(isEditable);
        editTextAddress.setEnabled(isEditable);
        editTextPhone.setEnabled(isEditable);
        clientEmailTextView.setEnabled(isEditable);
        clientNameTextView.setEnabled(isEditable);

        // Show or hide the Update button based on the editable state
        btnUpdate.setVisibility(isEditable ? View.VISIBLE : View.GONE);

        // Show or hide the Edit button based on the editable state
        btnEdit.setVisibility(!isEditable ? View.VISIBLE : View.GONE);
    }

    private void updateClientData() {
        // Retrieve the updated values from EditTexts
        String updatedMiddleName = editTextMiddleName.getText().toString();
        String updatedLastName = editTextLastName.getText().toString();
        String updatedAddress = editTextAddress.getText().toString();
        String updatedPhone = editTextPhone.getText().toString();
        String updatedEmail = clientEmailTextView.getText().toString();
        String updatedFirst = clientNameTextView.getText().toString();


        // Retrieve authentication token and user ID from SharedPreferences
        String authToken = sharedPreferencesManager.getAuthToken();
        String userId = sharedPreferencesManager.getUserId();

        // Call the API to update client data
        apiManager.updateClient(authToken, client_id, updatedMiddleName, updatedLastName, updatedAddress, updatedPhone, updatedEmail, updatedFirst, new ApiManager.OnApiCallCompleteListener<Void>() {
            @Override
            public void onSuccess(Void data) {
                // Handle success (if needed)
                showToast("Client data updated successfully!");
                setEditable(false);  // Set back to non-editable state after updating
            }

            @Override
            public void onFailure(String errorMessage) {
                // Handle failure (print error message, show an alert, etc.)
                showToast("Failed to update client data: " + errorMessage);
            }
        });
    }


}
