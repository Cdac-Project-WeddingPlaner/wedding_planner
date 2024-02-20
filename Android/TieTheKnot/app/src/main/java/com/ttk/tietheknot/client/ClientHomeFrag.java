package com.ttk.tietheknot.client;

import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;
import androidx.fragment.app.FragmentManager;
import androidx.fragment.app.FragmentTransaction;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.google.gson.JsonArray;
import com.ttk.tietheknot.API.ApiManager;
import com.ttk.tietheknot.R;
import com.ttk.tietheknot.SharedPreferencesManager;

import java.util.Map;

public class ClientHomeFrag extends Fragment implements ApiManager.OnApiCallCompleteListener<JsonArray>,
        PlanAdapter.OnAddButtonClickListener {

    private ApiManager apiManager;
    private SharedPreferencesManager sharedPreferencesManager;
    private PlanAdapter planAdapter;

    private String selectedService = "";

    private RecyclerView hallRecyclerView;
    private RecyclerView cateringRecyclerView;
    private RecyclerView musicRecyclerView;
    private RecyclerView photographyRecyclerView;
    private RecyclerView decorationRecyclerView;

    public ClientHomeFrag() {
        // Default constructor
    }

    public static ClientHomeFrag newInstance() {
        return new ClientHomeFrag();
    }

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        apiManager = new ApiManager();
        apiManager.getPlanByService(selectedService, this);
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        View view = inflater.inflate(R.layout.fragment_client_home, container, false);

        // Initialize RecyclerViews
        hallRecyclerView = view.findViewById(R.id.halllist);
        cateringRecyclerView = view.findViewById(R.id.Cateringlist);
        musicRecyclerView = view.findViewById(R.id.Musiclist);
        photographyRecyclerView = view.findViewById(R.id.Photographylist);
        decorationRecyclerView = view.findViewById(R.id.Decorationlist);

        // Set layout manager for each RecyclerView
        hallRecyclerView.setLayoutManager(new LinearLayoutManager(requireContext()));
        cateringRecyclerView.setLayoutManager(new LinearLayoutManager(requireContext()));
        musicRecyclerView.setLayoutManager(new LinearLayoutManager(requireContext()));
        photographyRecyclerView.setLayoutManager(new LinearLayoutManager(requireContext()));
        decorationRecyclerView.setLayoutManager(new LinearLayoutManager(requireContext()));

        // Initialize a single adapter for all services
        planAdapter = new PlanAdapter();
        planAdapter.setOnAddButtonClickListener(this);

        // Set initial adapter for the hall service
        hallRecyclerView.setAdapter(planAdapter);
        cateringRecyclerView.setAdapter(planAdapter);
        musicRecyclerView.setAdapter(planAdapter);
        photographyRecyclerView.setAdapter(planAdapter);
        decorationRecyclerView.setAdapter(planAdapter);

        // Move the showRecyclerViewForService call here
        showRecyclerViewForService(selectedService);

        return view;
    }

    @Override
    public void onViewCreated(@NonNull View view, @Nullable Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);

        // Set click listeners and other UI setup
        TextView hallTab = view.findViewById(R.id.halltab);
        TextView cateringTab = view.findViewById(R.id.Cateringtab);
        TextView musicTab = view.findViewById(R.id.Musictab);
        TextView photographyTab = view.findViewById(R.id.Photographytab);
        TextView decorationTab = view.findViewById(R.id.Decorationtab);

        hallTab.setOnClickListener(v -> onTabClicked("hall"));
        cateringTab.setOnClickListener(v -> onTabClicked("catering"));
        musicTab.setOnClickListener(v -> onTabClicked("music"));
        photographyTab.setOnClickListener(v -> onTabClicked("photography"));
        decorationTab.setOnClickListener(v -> onTabClicked("decoration"));

        // ... (other code)
    }

    private void onTabClicked(String service) {
        if (!selectedService.equals(service)) {
            selectedService = service;
            apiManager.getPlanByService(selectedService, this);

        }
    }

    private void showRecyclerViewForService(String service) {
        // Check if the fragment view is not null
        View fragmentView = getView();
        if (fragmentView != null) {
            // Hide all RecyclerViews
            hideAllRecyclerViews();

            // Show the RecyclerView for the selected service
            RecyclerView recyclerView = getRecyclerViewForService(fragmentView, service);
            recyclerView.setVisibility(View.VISIBLE);
        }
    }

    private void hideAllRecyclerViews() {
        // Hide all RecyclerViews
        View fragmentView = getView();
        if (fragmentView != null) {
            fragmentView.findViewById(R.id.halllist).setVisibility(View.GONE);
            fragmentView.findViewById(R.id.Cateringlist).setVisibility(View.GONE);
            fragmentView.findViewById(R.id.Musiclist).setVisibility(View.GONE);
            fragmentView.findViewById(R.id.Photographylist).setVisibility(View.GONE);
            fragmentView.findViewById(R.id.Decorationlist).setVisibility(View.GONE);
        }
    }

    private RecyclerView getRecyclerViewForService(View fragmentView, String service) {
        // Get the appropriate RecyclerView for the selected service
        switch (service) {
            case "hall":
                return fragmentView.findViewById(R.id.halllist);
            case "catering":
                return fragmentView.findViewById(R.id.Cateringlist);
            case "music":
                return fragmentView.findViewById(R.id.Musiclist);
            case "photography":
                return fragmentView.findViewById(R.id.Photographylist);
            case "decoration":
                return fragmentView.findViewById(R.id.Decorationlist);
            default:
                // Return a default RecyclerView or handle other cases if needed
                return fragmentView.findViewById(R.id.halllist);
        }
    }

    @Override
    public void onSuccess(JsonArray data) {
        if (planAdapter != null) {
            planAdapter.setData(data);
            showRecyclerViewForService(selectedService);
        }
    }

    @Override
    public void onFailure(String errorMessage) {
        // Handle failure by showing a Toast with the error message
        Toast.makeText(requireContext(), "Error: " + errorMessage, Toast.LENGTH_SHORT).show();
    }

    @Override
    public void onAddButtonClick(Map<String, Object> planItem) {
        openAddPlanDialog(planItem);
    }

    private void openAddPlanDialog(Map<String, Object> planItem) {
        AddPlanDialogFragment addPlanDialogFragment = AddPlanDialogFragment.newInstance(planItem);
        FragmentManager fragmentManager = requireActivity().getSupportFragmentManager();
        FragmentTransaction transaction = fragmentManager.beginTransaction();
        transaction.addToBackStack(null);
        addPlanDialogFragment.show(transaction, "AddPlanDialogFragment");
    }
}
