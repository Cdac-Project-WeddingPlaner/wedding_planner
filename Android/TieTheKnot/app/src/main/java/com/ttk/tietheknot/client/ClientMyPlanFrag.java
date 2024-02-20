package com.ttk.tietheknot.client;


import android.os.Bundle;

import androidx.fragment.app.Fragment;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;
import android.widget.Toast;

import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.reflect.TypeToken;
import com.ttk.tietheknot.API.ApiManager;
import com.ttk.tietheknot.DatePickerFragment;
import com.ttk.tietheknot.R;
import com.ttk.tietheknot.SharedPreferencesManager;

import java.lang.reflect.Type;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
public class ClientMyPlanFrag extends Fragment implements ApiManager.OnApiCallCompleteListener<JsonArray>, DatePickerFragment.OnDateSetListener {

    private ApiManager apiManager;
    private SharedPreferencesManager sharedPreferencesManager;
    private String authToken;
    private String userId;

    private RecyclerView recyclerView;
    private TextView totalTextView;

    MyPlanAdapter adapter;

    public ClientMyPlanFrag() {
        // Required empty public constructor
    }

    public static ClientMyPlanFrag newInstance(String param1, String param2) {
        ClientMyPlanFrag fragment = new ClientMyPlanFrag();
        Bundle args = new Bundle();
//        args.putString(ARG_PARAM1, param1);
//        args.putString(ARG_PARAM2, param2);
        fragment.setArguments(args);
        return fragment;
    }

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        apiManager = new ApiManager();
        sharedPreferencesManager = new SharedPreferencesManager(requireContext());

        authToken = sharedPreferencesManager.getAuthToken();
        userId = sharedPreferencesManager.getUserId();

        if (authToken != null && userId != null) {
            apiManager.getSelectPlansByUId(authToken, userId, this);
        } else {
            showToast("Authentication token or user ID is null.");
        }
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        View rootView = inflater.inflate(R.layout.fragment_client_my_plan, container, false);

        recyclerView = rootView.findViewById(R.id.myplanlist);
        totalTextView = rootView.findViewById(R.id.totalp);

        // Initialize RecyclerView
        LinearLayoutManager layoutManager = new LinearLayoutManager(requireContext());
        recyclerView.setLayoutManager(layoutManager);

        return rootView;
    }

    @Override
    public void onResume() {
        super.onResume();

        // Recall the API and refresh RecyclerView
        recallApi();
    }

    private void showToast(String message) {
        Toast.makeText(requireContext(), message, Toast.LENGTH_SHORT).show();
    }

    @Override
    public void onSuccess(JsonArray data) {
        List<Map<String, Object>> plans = parseData(data);

        // Assuming you have a hypothetical PlanAdapter, adapt this based on your data structure
        adapter = new MyPlanAdapter(plans);
        Log.e("myplan", plans.toString());
        recyclerView.setAdapter(adapter);

        // Calculate and display total price
        int totalPrice = calculateTotalPrice(plans);
        totalTextView.setText("Total : " + totalPrice);
    }

    private List<Map<String, Object>> parseData(JsonArray data) {
        List<Map<String, Object>> plans = new ArrayList<>();

        for (JsonElement element : data) {
            JsonObject planObject = element.getAsJsonObject();

            // Extract relevant fields from the JsonObject
            String title = planObject.get("title").getAsString();
            int price = planObject.get("price").getAsInt();
            String serviceType = planObject.get("service_type").getAsString();
            String status = planObject.get("status").getAsString();

            // Create a new Map to represent the plan item
            Map<String, Object> planItem = new HashMap<>();
            planItem.put("title", title);
            planItem.put("price", price);
            planItem.put("service_type", serviceType);
            planItem.put("status", status);

            // Add the planItem to the list
            plans.add(planItem);
        }

        return plans;
    }

    private void recallApi() {
        // Perform API call using your ApiManager
        // Update the plans data in the adapter once the API call is complete
        apiManager.getSelectPlansByUId(authToken, userId, new ApiManager.OnApiCallCompleteListener<JsonArray>() {
            @Override
            public void onSuccess(JsonArray data) {
                List<Map<String, Object>> newPlans = parseData(data);
                adapter.updateData(newPlans);
            }

            @Override
            public void onFailure(String errorMessage) {
                Log.e("plans data", errorMessage);
            }
        });
    }

    private int calculateTotalPrice(List<Map<String, Object>> plans) {
        int totalPrice = 0;

        for (Map<String, Object> planItem : plans) {
            int price = (int) planItem.get("price");
            totalPrice += price;
        }

        return totalPrice;
    }

    @Override
    public void onFailure(String errorMessage) {
        Log.e("plans data", errorMessage);
    }

    @Override
    public void onDateSet(String formattedDate) {
        // Handle date set event
    }
}

