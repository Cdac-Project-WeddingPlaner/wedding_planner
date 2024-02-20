package com.ttk.tietheknot.client;

import android.content.Context;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import com.ttk.tietheknot.R;

import java.util.List;
import java.util.Map;

public class MyPlanAdapter extends RecyclerView.Adapter<MyPlanAdapter.PlanViewHolder> {

    private List<Map<String, Object>> plans;
    private Context context;

    public MyPlanAdapter(List<Map<String, Object>> plans) {
        this.plans = plans;
    }

    @NonNull
    @Override
    public PlanViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        context = parent.getContext();
        View view = LayoutInflater.from(context).inflate(R.layout.myplanview, parent, false);
        return new PlanViewHolder(view);
    }

    @Override
    public void onBindViewHolder(@NonNull PlanViewHolder holder, int position) {
        Map<String, Object> planItem = plans.get(position);

        holder.serviceTextView.setText((String) planItem.get("service_type"));
        holder.planTitleTextView.setText((String) planItem.get("title"));
        holder.priceTextView.setText("₹ " + planItem.get("price"));
        String status = (String) planItem.get("status");
        holder.statusTextView.setText(status);

        // Change the color of statusTextView based on status
        if ("pending".equalsIgnoreCase(status)) {
            holder.statusTextView.setTextColor(context.getResources().getColor(android.R.color.holo_orange_dark));
        } else if ("confirmed".equalsIgnoreCase(status)) {
            holder.statusTextView.setTextColor(context.getResources().getColor(android.R.color.holo_green_dark));
        } else if ("rejected".equalsIgnoreCase(status)) {
            holder.statusTextView.setTextColor(context.getResources().getColor(android.R.color.holo_red_dark));
        }

        // Example: If you want to handle a button click event
        holder.removeButton.setOnClickListener(v -> {
            // Handle button click, you can remove the item from the list, update UI, etc.
            plans.remove(position);
            notifyDataSetChanged(); // Notify the adapter that the data has changed
        });
    }

    @Override
    public int getItemCount() {
        return plans.size();
    }

    static class PlanViewHolder extends RecyclerView.ViewHolder {
        TextView serviceTextView;
        TextView planTitleTextView;
        TextView priceTextView;
        TextView statusTextView;
        Button removeButton;

        PlanViewHolder(@NonNull View itemView) {
            super(itemView);

            serviceTextView = itemView.findViewById(R.id.service);
            planTitleTextView = itemView.findViewById(R.id.plantitle);
            priceTextView = itemView.findViewById(R.id.price);
            statusTextView = itemView.findViewById(R.id.status);
            removeButton = itemView.findViewById(R.id.addplan);
        }
    }
    public void updateData(List<Map<String, Object>> newPlans) {
        plans.clear();  // Clear existing data
        plans.addAll(newPlans);  // Add new data
        notifyDataSetChanged();  // Notify the adapter that the data has changed
    }
}
