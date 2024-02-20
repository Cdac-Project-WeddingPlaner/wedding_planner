package com.ttk.tietheknot.client;

import android.app.DatePickerDialog;
import android.app.Dialog;
import android.app.TimePickerDialog;
import android.content.Intent;
import android.os.Bundle;
import android.text.format.DateFormat;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.DatePicker;
import android.widget.TextView;
import android.widget.TimePicker;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.DialogFragment;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import com.google.gson.reflect.TypeToken;
import com.ttk.tietheknot.API.ApiManager;
import com.ttk.tietheknot.LoginActivity;
import com.ttk.tietheknot.R;
import com.ttk.tietheknot.SharedPreferencesManager;

import java.io.Serializable;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Map;

public class AddPlanDialogFragment extends DialogFragment implements
        DatePickerDialog.OnDateSetListener,
        TimePickerDialog.OnTimeSetListener {

    private TextView planDetailsTextView;
    private TextView selectedDateTextView;
    private TextView selectedTimeTextView;
    private Button addButton;
    private String plan_id;

    private Calendar selectedDateTime;

    public static AddPlanDialogFragment newInstance(Map<String, Object> planItem) {
        AddPlanDialogFragment fragment = new AddPlanDialogFragment();
        Bundle args = new Bundle();
        args.putSerializable("planItem", new Gson().toJsonTree(planItem).getAsJsonObject().toString());
        fragment.setArguments(args);
        return fragment;
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        View view = inflater.inflate(R.layout.fragment_add_plan_dialog, container, false);

        planDetailsTextView = view.findViewById(R.id.planDetailsTextView);
        selectedDateTextView = view.findViewById(R.id.selectedDateTextView);
        selectedTimeTextView = view.findViewById(R.id.selectedTimeTextView);
        addButton = view.findViewById(R.id.addButton);

        if (getArguments() != null) {
            String planItemJson = getArguments().getString("planItem");
            if (planItemJson != null) {
                Map<String, Object> planItem = new Gson().fromJson(planItemJson, new TypeToken<Map<String, Object>>() {}.getType());
                if (planItem != null) {
                    Log.e("plann", planItem.toString());
                    planDetailsTextView.setText((String) planItem.get("title"));
                    Log.e("plannid", planItem.get("plan_id").toString());
                    plan_id = planItem.get("plan_id").toString();
                }
            }
        }

        selectedDateTime = Calendar.getInstance();

        selectedDateTextView.setOnClickListener(v -> showDatePicker());
        selectedTimeTextView.setOnClickListener(v -> showTimePicker());
        addButton.setOnClickListener(v -> onAddButtonClicked());

        return view;
    }

    private void showDatePicker() {
        int year = selectedDateTime.get(Calendar.YEAR);
        int month = selectedDateTime.get(Calendar.MONTH);
        int day = selectedDateTime.get(Calendar.DAY_OF_MONTH);

        DatePickerDialog datePickerDialog = new DatePickerDialog(requireContext(), this, year, month, day);
        datePickerDialog.show();
    }

    private void showTimePicker() {
        int hour = selectedDateTime.get(Calendar.HOUR_OF_DAY);
        int minute = selectedDateTime.get(Calendar.MINUTE);

        TimePickerDialog timePickerDialog = new TimePickerDialog(requireContext(), this, hour, minute, DateFormat.is24HourFormat(requireContext()));
        timePickerDialog.show();
    }

    private void onAddButtonClicked() {
        SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
        SimpleDateFormat timeFormat = new SimpleDateFormat("HH:mm:ss");

        String formattedDate = dateFormat.format(selectedDateTime.getTime());
        String formattedTime = timeFormat.format(selectedDateTime.getTime());
        SharedPreferencesManager sharedPreferencesManager = new SharedPreferencesManager(requireContext());

        String authToken = sharedPreferencesManager.getAuthToken();
        String userId = sharedPreferencesManager.getUserId();
        JsonObject plantoadd = new JsonObject();
        plantoadd.addProperty("plan_id", plan_id);
        plantoadd.addProperty("date", formattedDate.toString());
        plantoadd.addProperty("time", formattedTime.toString());

        ApiManager apiManager = new ApiManager();
        apiManager.addPlanInSelection(authToken, userId, plantoadd, new ApiManager.OnApiCallCompleteListener<JsonObject>() {
            @Override
            public void onSuccess(JsonObject data) {
                String message = "Plan added!\nDate: " + formattedDate + "\nTime: " + formattedTime;
                Toast.makeText(requireContext(), message, Toast.LENGTH_SHORT).show();

                dismiss();
            }

            @Override
            public void onFailure(String errorMessage) {
                // Handle failure, display error message, etc.
                Toast.makeText(requireContext(), errorMessage, Toast.LENGTH_SHORT).show();
                dismiss();
            }
        });
        }

        @Override
    public void onDateSet(DatePicker view, int year, int month, int dayOfMonth) {
        selectedDateTime.set(year, month, dayOfMonth);
        updateDateTextView();
    }

    @Override
    public void onTimeSet(TimePicker view, int hourOfDay, int minute) {
        selectedDateTime.set(Calendar.HOUR_OF_DAY, hourOfDay);
        selectedDateTime.set(Calendar.MINUTE, minute);
        updateTimeTextView();
    }

    private void updateDateTextView() {
        SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
        String formattedDate = dateFormat.format(selectedDateTime.getTime());
        selectedDateTextView.setText("Selected Date: " + formattedDate);
    }

    private void updateTimeTextView() {
        SimpleDateFormat timeFormat = new SimpleDateFormat("HH:mm:ss");
        String formattedTime = timeFormat.format(selectedDateTime.getTime());
        selectedTimeTextView.setText("Selected Time: " + formattedTime);
    }
}
