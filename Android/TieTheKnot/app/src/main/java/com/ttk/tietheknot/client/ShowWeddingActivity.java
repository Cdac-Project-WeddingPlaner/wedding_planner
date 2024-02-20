package com.ttk.tietheknot.client;

import android.annotation.SuppressLint;
import android.os.Bundle;
import android.view.View;
import android.widget.ArrayAdapter;
import android.widget.Button;
import android.widget.EditText;
import android.widget.Spinner;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;

import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import com.ttk.tietheknot.API.ApiManager;
import com.ttk.tietheknot.DatePickerFragment;
import com.ttk.tietheknot.R;
import com.ttk.tietheknot.SharedPreferencesManager;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Locale;

public class ShowWeddingActivity extends AppCompatActivity implements ApiManager.OnApiCallCompleteListener<JsonArray>, DatePickerFragment.OnDateSetListener {

    private ApiManager apiManager;
    private SharedPreferencesManager sharedPreferencesManager;

    private EditText brideNameEditText;
    private EditText groomNameEditText;
    private EditText relationEditText;
    private EditText weddingDateEditText;
    private EditText guestCountEditText;
    private Button btnEdit;
    private Button btnUpdate;
    private Spinner sideSpinner; // Declare Spinner here

    private String clientId;
    private String authToken;

    @SuppressLint("MissingInflatedId")
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_show_wedding);

        apiManager = new ApiManager();
        sharedPreferencesManager = new SharedPreferencesManager(getApplicationContext());

        brideNameEditText = findViewById(R.id.editTextBrideName);
        groomNameEditText = findViewById(R.id.editTextGroomName);
        relationEditText = findViewById(R.id.editTextRelation);
        weddingDateEditText = findViewById(R.id.editTextWeddingDate);
        guestCountEditText = findViewById(R.id.editTextGuestCount);
        btnEdit = findViewById(R.id.btnEdit);
        btnUpdate = findViewById(R.id.btnUpdate);

        // Initialize Spinner
        sideSpinner = findViewById(R.id.spinnerSide);

        setEditable(false);

        // Retrieve authentication token and user ID from SharedPreferences
        authToken = sharedPreferencesManager.getAuthToken();
        String userId = sharedPreferencesManager.getUserId();

        if (authToken != null && userId != null) {
            // Use the ApiManager to get wedding data
            apiManager.getWeddingDeByUId(authToken, userId, this);
        } else {
            showToast("Authentication token or user ID is null.");
        }

        // Set click listeners for Edit and Update buttons
        btnEdit.setOnClickListener(v -> setEditable(true));
        btnUpdate.setOnClickListener(v -> updateWeddingData());

        // Set click listener for the date field to show date picker
        weddingDateEditText.setOnClickListener(v -> showDatePickerDialog());
    }

    @Override
    public void onSuccess(JsonArray data) {
        if (data.size() > 0) {
            JsonObject weddingData = data.get(0).getAsJsonObject();
            displayResponseInUI(weddingData);
        } else {
            showToast("Empty array received for wedding details");
        }
    }

    @Override
    public void onFailure(String errorMessage) {
        showToast("Failed to fetch wedding data: " + errorMessage);
    }

    private void displayResponseInUI(JsonObject data) {
        clientId = data.getAsJsonPrimitive("client_id").getAsString();
        String brideName = data.getAsJsonPrimitive("bride_name").getAsString();
        String groomName = data.getAsJsonPrimitive("groom_name").getAsString();
        String relation = data.getAsJsonPrimitive("relation").getAsString();
        String weddingDate = data.getAsJsonPrimitive("wedding_date").getAsString();
        String guestCount = data.getAsJsonPrimitive("guest_count").getAsString();
        String selectedSide = data.getAsJsonPrimitive("selected_side").getAsString();

        brideNameEditText.setText(brideName);
        groomNameEditText.setText(groomName);
        relationEditText.setText(relation);

        // Format the date before setting it
        try {
            Date originalDate = new SimpleDateFormat("yyyy-MM-dd", Locale.getDefault()).parse(weddingDate);
            String formattedDate = new SimpleDateFormat("yyyy-MM-dd", Locale.getDefault()).format(originalDate);
            weddingDateEditText.setText(formattedDate);
        } catch (ParseException e) {
            e.printStackTrace();
        }

        guestCountEditText.setText(guestCount);

        // Set the selected side in the spinner
        ArrayAdapter<CharSequence> adapter = ArrayAdapter.createFromResource(this,
                R.array.sides, android.R.layout.simple_spinner_item);
        adapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item);
        sideSpinner.setAdapter(adapter);
        int position = adapter.getPosition(selectedSide);
        sideSpinner.setSelection(position);
    }

    private void showToast(String message) {
        Toast.makeText(this, message, Toast.LENGTH_SHORT).show();
    }

    private void setEditable(boolean isEditable) {
        brideNameEditText.setEnabled(isEditable);
        groomNameEditText.setEnabled(isEditable);
        relationEditText.setEnabled(isEditable);
        weddingDateEditText.setEnabled(isEditable);
        guestCountEditText.setEnabled(isEditable);
        sideSpinner.setEnabled(isEditable);

        btnUpdate.setVisibility(isEditable ? View.VISIBLE : View.GONE);
        btnEdit.setVisibility(!isEditable ? View.VISIBLE : View.GONE);
    }

    private void showDatePickerDialog() {
        DatePickerFragment newFragment = new DatePickerFragment();
        Bundle args = new Bundle();
        args.putString("selectedDate", weddingDateEditText.getText().toString());
        newFragment.setArguments(args);
        newFragment.setOnDateSetListener(this);
        newFragment.show(getSupportFragmentManager(), "datePicker");
    }

    @Override
    public void onDateSet(String formattedDate) {
        weddingDateEditText.setText(formattedDate);
    }

    private void updateWeddingData() {
        String updatedBrideName = brideNameEditText.getText().toString();
        String updatedGroomName = groomNameEditText.getText().toString();
        String updatedRelation = relationEditText.getText().toString();
        String updatedWeddingDate = weddingDateEditText.getText().toString();
        String updatedGuestCount = guestCountEditText.getText().toString();
        String updatedSide = sideSpinner.getSelectedItem().toString();

        apiManager.updateWedding(authToken, clientId, updatedSide, updatedBrideName, updatedGroomName, updatedRelation, updatedWeddingDate, updatedGuestCount, new ApiManager.OnApiCallCompleteListener<JsonObject>() {

            @Override
            public void onSuccess(JsonObject data) {
                showToast("Wedding data updated successfully!");
                setEditable(false);
            }

            @Override
            public void onFailure(String errorMessage) {
                showToast("Failed to update wedding data: " + errorMessage);
            }
        });
    }
}
