package com.ttk.tietheknot;

import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.provider.MediaStore;
import android.text.TextUtils;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.Toast;

import androidx.activity.result.ActivityResultLauncher;
import androidx.activity.result.contract.ActivityResultContracts;
import androidx.annotation.Nullable;
import androidx.appcompat.app.AppCompatActivity;

import com.google.gson.JsonObject;
import com.ttk.tietheknot.API.ApiManager;
import com.ttk.tietheknot.client.CreateWeddingActivity;

import java.io.File;
import java.io.IOException;

public class UserRegisterActivity extends AppCompatActivity {

    private static final int PICK_IMAGE_REQUEST = 1;

    private EditText emailEditText, passwordEditText, firstNameEditText, lastNameEditText,
            phoneNumberEditText, addressEditText;

    private Button registerButton, selectImageButton;
    private File selectedImageFile;

    private ApiManager apiManager;

    // ActivityResultLauncher for image picking
    private ActivityResultLauncher<Intent> pickImageLauncher;

    @Override
    protected void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_user_register);

        emailEditText = findViewById(R.id.emailEditText);
        passwordEditText = findViewById(R.id.passwordEditText);
        firstNameEditText = findViewById(R.id.firstNameEditText);
        lastNameEditText = findViewById(R.id.lastNameEditText);
        phoneNumberEditText = findViewById(R.id.phoneNumberEditText);
        addressEditText = findViewById(R.id.addressEditText);

        registerButton = findViewById(R.id.registerButton);
        selectImageButton = findViewById(R.id.selectImageButton);

        apiManager = new ApiManager();

        // Initialize ActivityResultLauncher for image picking
        pickImageLauncher = registerForActivityResult(new ActivityResultContracts.StartActivityForResult(), result -> {
            if (result.getResultCode() == RESULT_OK && result.getData() != null) {
                Uri selectedImageUri = result.getData().getData();
                if (selectedImageUri != null) {
                    try {
                        selectedImageFile = FileUtil.from(this, selectedImageUri);
                        // Update UI or display the selected image if needed
                    } catch (IOException e) {
                        e.printStackTrace();
                        Toast.makeText(UserRegisterActivity.this, "Error selecting image", Toast.LENGTH_SHORT).show();
                    }
                }
            }
        });

        selectImageButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                openImagePicker();
            }
        });

        registerButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                registerClient();
            }
        });
    }

    private void openImagePicker() {
        Intent galleryIntent = new Intent(Intent.ACTION_PICK, MediaStore.Images.Media.EXTERNAL_CONTENT_URI);
        pickImageLauncher.launch(galleryIntent);
    }

    private void registerClient() {
        String email = emailEditText.getText().toString();
        String password = passwordEditText.getText().toString();
        String firstName = firstNameEditText.getText().toString();
        String lastName = lastNameEditText.getText().toString();
        String phoneNumber = phoneNumberEditText.getText().toString();
        String address = addressEditText.getText().toString();

        // Input validation
        if (TextUtils.isEmpty(email) || TextUtils.isEmpty(password) || TextUtils.isEmpty(firstName)
                || TextUtils.isEmpty(lastName) || TextUtils.isEmpty(phoneNumber) || TextUtils.isEmpty(address)) {
            Toast.makeText(UserRegisterActivity.this, "Please fill in all fields", Toast.LENGTH_SHORT).show();
            return;
        }

        // Loading indicator (ProgressBar) - Show loading indicator here

        apiManager.registerClient(email, password, firstName, lastName, phoneNumber, address, selectedImageFile, new ApiManager.OnApiCallCompleteListener<JsonObject>() {
            @Override
            public void onSuccess(JsonObject data) {
                Log.e("reg" , data.toString());
                if (data.has("client_id")) {
                    int clientId = data.get("client_id").getAsInt();

                    // Provide user feedback (e.g., toast)
                    Toast.makeText(UserRegisterActivity.this, "Registration successful", Toast.LENGTH_SHORT).show();

                    // Forward to CreateWeddingActivity with the extracted client_id
                    forwardToCreateWeddingActivity(clientId);
                } else {
                    // Handle the case where client_id is not present in the response
                    Log.e("RegistrationActivity", "Client ID not found in the response");
                    Toast.makeText(UserRegisterActivity.this, "Registration successful, but client ID not found", Toast.LENGTH_SHORT).show();
                }
            }

            @Override
            public void onFailure(String errorMessage) {
                // Hide loading indicator here
                Log.e("RegistrationActivity", "Registration failed. Error: " + errorMessage);
                // Provide user feedback (e.g., toast, dialog)
                Toast.makeText(UserRegisterActivity.this, "Registration failed. Error: " + errorMessage, Toast.LENGTH_SHORT).show();
            }
        });
    }

    private void forwardToCreateWeddingActivity(int clientId) {
        Intent createWeddingIntent = new Intent(UserRegisterActivity.this, CreateWeddingActivity.class);
        String cid = String.valueOf(clientId);
        createWeddingIntent.putExtra("client_id", cid);
        startActivity(createWeddingIntent);
        // Add any additional setup or data passing as needed
    }
}
