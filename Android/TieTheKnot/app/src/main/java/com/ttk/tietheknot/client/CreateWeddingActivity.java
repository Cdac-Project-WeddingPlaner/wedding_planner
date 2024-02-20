// CreateWeddingActivity.java

package com.ttk.tietheknot.client;

import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.ArrayAdapter;
import android.widget.Button;
import android.widget.EditText;
import android.widget.Spinner;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;

import com.google.gson.JsonObject;
import com.ttk.tietheknot.API.ApiManager;
import com.ttk.tietheknot.DatePickerFragment;
import com.ttk.tietheknot.LoginActivity;
import com.ttk.tietheknot.R;

public class CreateWeddingActivity extends AppCompatActivity {

    private EditText brideNameEditText;
    private EditText groomNameEditText;
    private Spinner sideSpinner;
    private EditText relationEditText;
    private EditText weddingDateEditText;
    private EditText guestCountEditText;
    private String clientId;
    private Button createWeddingButton;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_create_wedding);

        brideNameEditText = findViewById(R.id.editTextBrideName);
        groomNameEditText = findViewById(R.id.editTextGroomName);
        sideSpinner = findViewById(R.id.spinnerSide);
        relationEditText = findViewById(R.id.editTextRelation);
        weddingDateEditText = findViewById(R.id.editTextWeddingDate);
        guestCountEditText = findViewById(R.id.editTextGuestCount);
        createWeddingButton = findViewById(R.id.buttonCreateWedding);

        ArrayAdapter<CharSequence> adapter = ArrayAdapter.createFromResource(this,
                R.array.sides, android.R.layout.simple_spinner_item);
        adapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item);
        sideSpinner.setAdapter(adapter);

        weddingDateEditText.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                showDatePickerDialog();
            }
        });

        createWeddingButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                createWedding(clientId);
            }
        });

        // Retrieve client_id from the Intent
        Intent intent = getIntent();
        if (intent.hasExtra("client_id")) {
            clientId = intent.getStringExtra("client_id");

            createWeddingButton.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View v) {
                    createWedding(clientId);
                }
            });
        } else {
            // Handle the case where client_id is not provided
            Toast.makeText(this, "Client ID not found in the Intent", Toast.LENGTH_SHORT).show();
            // Optionally, you may finish the activity or take appropriate action
        }
    }

    private void createWedding(String clientId) {
        // Collect data from UI components
        String brideName = brideNameEditText.getText().toString();
        String groomName = groomNameEditText.getText().toString();
        String side = sideSpinner.getSelectedItem().toString();
        String relation = relationEditText.getText().toString();
        String weddingDate = weddingDateEditText.getText().toString();
        int guestCount = Integer.parseInt(guestCountEditText.getText().toString());

        // Create a JsonObject with the collected data
        JsonObject weddingData = new JsonObject();
        weddingData.addProperty("client_id", clientId);
        weddingData.addProperty("selected_side", side);
        weddingData.addProperty("bride_name", brideName);
        weddingData.addProperty("groom_name", groomName);
        weddingData.addProperty("relation", relation);
        weddingData.addProperty("wedding_date", weddingDate);
        weddingData.addProperty("guest_count", guestCount);

        // Assuming you have an instance of ApiManager and a valid authentication token
        ApiManager apiManager = new ApiManager();

        apiManager.createWedding(weddingData, new ApiManager.OnApiCallCompleteListener<JsonObject>() {
            @Override
            public void onSuccess(JsonObject data) {
                // Handle success, if needed
                Toast.makeText(CreateWeddingActivity.this, "Wedding created successfully", Toast.LENGTH_SHORT).show();
                // Redirect to LoginActivity
                Intent loginIntent = new Intent(CreateWeddingActivity.this, LoginActivity.class);
                startActivity(loginIntent);
                finish(); // Optional: Close the current activity if needed
            }

            @Override
            public void onFailure(String errorMessage) {
                // Handle failure, display error message, etc.
                Toast.makeText(CreateWeddingActivity.this, errorMessage, Toast.LENGTH_SHORT).show();
            }
        });
    }

    private void showDatePickerDialog() {
        DatePickerFragment newFragment = new DatePickerFragment();

        // Set the OnDateSetListener before showing the DatePickerFragment
        newFragment.setOnDateSetListener(new DatePickerFragment.OnDateSetListener() {
            @Override
            public void onDateSet(String formattedDate) {
                // Update the UI with the selected date if needed
                weddingDateEditText.setText(formattedDate);
            }
        });

        newFragment.show(getSupportFragmentManager(), "datePicker");
    }
}
