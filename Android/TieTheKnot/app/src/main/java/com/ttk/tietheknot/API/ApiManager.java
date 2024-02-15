package com.ttk.tietheknot.API;

import com.google.gson.JsonArray;
import com.google.gson.JsonObject;

import java.io.File;

public class ApiManager {

    private ApiService apiService;

    private LoginManager loginManager;
    private VendorRegistrationManager vendorRegistrationManager;
    private ClientRegistrationManager clientRegistrationManager;
    private GetAllPlansManager getAllPlansManager;

    public ApiManager() {
        this.apiService = RetrofitBuilder.createApiService();
        this.loginManager = new LoginManager(apiService);
        this.vendorRegistrationManager = new VendorRegistrationManager(apiService);
        this.clientRegistrationManager = new ClientRegistrationManager(apiService);
        this.getAllPlansManager = new GetAllPlansManager(apiService);
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

    public void registerClient(String email, String password, String firstName, String lastName,
                               String phoneNumber, String address, File avatarImage,
                               OnApiCallCompleteListener<JsonObject> listener) {
        clientRegistrationManager.registerClient(email, password, firstName, lastName, phoneNumber,
                address, avatarImage, listener);
    }

    public void getAllPlans(OnApiCallCompleteListener<JsonArray> listener) {
        getAllPlansManager.getAllPlans(listener);
    }

    public interface OnApiCallCompleteListener<T> {
        void onSuccess(T data);

        void onFailure(String errorMessage);
    }

    public interface OnLoginCompleteListener extends OnApiCallCompleteListener<JsonObject> {
    }
}
