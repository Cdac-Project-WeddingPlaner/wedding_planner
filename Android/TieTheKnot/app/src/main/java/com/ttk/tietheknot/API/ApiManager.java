package com.ttk.tietheknot.API;

import android.util.Log;

import com.google.gson.JsonArray;
import com.google.gson.JsonObject;

import java.io.File;

public class ApiManager {

    private ApiService apiService;

    private LoginManager loginManager;
    private VendorRegistrationManager vendorRegistrationManager;
    private ClientRegistrationManager clientRegistrationManager;
    private GetAllPlansManager getAllPlansManager;
    private GetClientByIdManager getClientByIdManager;
    private UpdateClientManager updateClientManager;

    public ApiManager() {
        this.apiService = RetrofitBuilder.createApiService();
        this.loginManager = new LoginManager(apiService);
        this.vendorRegistrationManager = new VendorRegistrationManager(apiService);
        this.clientRegistrationManager = new ClientRegistrationManager(apiService);
        this.getAllPlansManager = new GetAllPlansManager(apiService);
        this.getClientByIdManager = new GetClientByIdManager(apiService);
        this.updateClientManager = new UpdateClientManager(apiService);
    }

    public void login(String email, String password, OnApiCallCompleteListener<JsonObject> listener) {
        loginManager.login(email, password, listener);
    }

    public void registerVendor(String email, String password, String firstName, String middleName, String lastName,
                               String phoneNumber, String address, String serviceType, String businessName,
                               String contactEmail, String altarnetNumber, String businessAddress, String description,
                               File logoImage, OnApiCallCompleteListener<JsonObject> listener) {
        vendorRegistrationManager.registerVendor(email, password, firstName, middleName, lastName, phoneNumber,
                address, serviceType, businessName, contactEmail, altarnetNumber, businessAddress, description,
                logoImage, listener);
    }

    public void updateClient(String authToken, String userId, String updatedMiddleName, String updatedLastName, String updatedAddress, String updatedPhone,String updatedEmail,String updatedName, ApiManager.OnApiCallCompleteListener<Void> listener) {
        // Construct the updateRequestBody
        JsonObject updateRequestBody = new JsonObject();
        updateRequestBody.addProperty("middle_name", updatedMiddleName);
        updateRequestBody.addProperty("last_name", updatedLastName);
        updateRequestBody.addProperty("address", updatedAddress);
        updateRequestBody.addProperty("first_name", updatedName);
        updateRequestBody.addProperty("phone_number", updatedPhone);
        updateRequestBody.addProperty("email", updatedEmail);

        // Call the API to update client data
        updateClientManager.updateClient(authToken, userId, updateRequestBody, listener);
    }

    public void registerClient(String email, String password, String firstName, String lastName,
                               String phoneNumber, String address, File avatarImage,
                               OnApiCallCompleteListener<JsonObject> listener) {
        clientRegistrationManager.registerClient(email, password, firstName, lastName, phoneNumber,
                address, avatarImage, listener);
    }

    public void getAllPlans(OnApiCallCompleteListener<JsonArray> listener) {
        getAllPlansManager.getAllPlans(listener);
    }

    public void getClientById(String authToken, String userId, OnApiCallCompleteListener<JsonObject> listener) {
        getClientByIdManager.getClientById(authToken, userId, listener);
    }

    public interface OnApiCallCompleteListener<T> {
        void onSuccess(T data);

        void onFailure(String errorMessage);
    }

    public interface OnLoginCompleteListener extends OnApiCallCompleteListener<JsonObject> {
    }
}
