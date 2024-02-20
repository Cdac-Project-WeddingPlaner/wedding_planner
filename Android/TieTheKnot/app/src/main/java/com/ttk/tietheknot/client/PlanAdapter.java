package com.ttk.tietheknot.client;

import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.RatingBar;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import com.google.gson.reflect.TypeToken;
import com.ttk.tietheknot.R;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

public class PlanAdapter extends RecyclerView.Adapter<PlanAdapter.PlanViewHolder> {

    private List<Map<String, Object>> planList;
    private OnAddButtonClickListener addButtonClickListener;

    public void setData(JsonArray jsonArray) {
        this.planList = parseJsonArray(jsonArray);
        notifyDataSetChanged();
    }

    public void setOnAddButtonClickListener(OnAddButtonClickListener listener) {
        this.addButtonClickListener = listener;
    }

    @NonNull
    @Override
    public PlanViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(parent.getContext()).inflate(R.layout.planview, parent, false);
        return new PlanViewHolder(view);
    }

    @Override
    public void onBindViewHolder(@NonNull PlanViewHolder holder, int position) {
        Map<String, Object> planItem = planList.get(position);

        holder.titleTextView.setText((String) planItem.get("title"));
        holder.descriptionTextView.setText((String) planItem.get("description"));

        Object ratingObject = planItem.get("rating");
        if (ratingObject instanceof Float) {
            float rating = (Float) ratingObject;
            holder.ratingBar.setRating(rating);
        } else {

            holder.ratingBar.setRating(0);
        }

        holder.priceTextView.setText("₹ " + String.valueOf(planItem.get("price")));
        holder.countrTextView.setText(String.valueOf(planItem.get("count")));

        holder.addButton.setOnClickListener(v -> {
            if (addButtonClickListener != null) {
                addButtonClickListener.onAddButtonClick(planItem);
            }
        });
    }

    @Override
    public int getItemCount() {
        return planList != null ? planList.size() : 0;
    }

    public static class PlanViewHolder extends RecyclerView.ViewHolder {
        TextView titleTextView;
        TextView descriptionTextView;
        RatingBar ratingBar;
        TextView priceTextView;
        TextView countrTextView;

        Button addButton;

        public PlanViewHolder(@NonNull View itemView) {
            super(itemView);
            titleTextView = itemView.findViewById(R.id.plantitle);
            descriptionTextView = itemView.findViewById(R.id.description);
            ratingBar = itemView.findViewById(R.id.ratingBar);
            priceTextView = itemView.findViewById(R.id.price);
            countrTextView = itemView.findViewById(R.id.countr);
            addButton = itemView.findViewById(R.id.addplan);
        }
    }

    private List<Map<String, Object>> parseJsonArray(JsonArray jsonArray) {
        List<Map<String, Object>> planItemList = new ArrayList<>();

        for (int i = 0; i < jsonArray.size(); i++) {
            JsonObject jsonObject = jsonArray.get(i).getAsJsonObject();

            Map<String, Object> planItem = new Gson().fromJson(jsonObject, new TypeToken<Map<String, Object>>() {}.getType());

            if (planItem.containsKey("rating")) {
                Object ratingObject = planItem.get("rating");
                if (ratingObject instanceof Double) {
                    float ratingFloat = ((Double) ratingObject).floatValue();
                    planItem.put("rating", ratingFloat);
                }
            }

            planItemList.add(planItem);
        }

        return planItemList;
    }

    public interface OnAddButtonClickListener {
        void onAddButtonClick(Map<String, Object> planItem);
    }
}
