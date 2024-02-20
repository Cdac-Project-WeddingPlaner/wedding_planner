package com.ttk.tietheknot.client;

import android.content.Intent;
import android.os.Bundle;
import android.view.Menu;
import android.view.MenuItem;

import androidx.appcompat.app.AppCompatActivity;
import androidx.appcompat.widget.Toolbar;
import androidx.viewpager2.widget.ViewPager2;

import com.google.android.material.bottomnavigation.BottomNavigationView;
import com.google.android.material.tabs.TabLayout;
import com.google.android.material.tabs.TabLayoutMediator;
import com.ttk.tietheknot.R;

public class ClientActivity extends AppCompatActivity {

    private ViewPager2 viewPager;
    private ClientPagerAdapter pagerAdapter;
    private BottomNavigationView bottomNavigationView;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_client);

        // Toolbar setup
        Toolbar toolbar = findViewById(R.id.toolbar);
        setSupportActionBar(toolbar);
        getSupportActionBar().setDisplayShowTitleEnabled(false);

        // ViewPager2 setup
        viewPager = findViewById(R.id.viewPager);
        pagerAdapter = new ClientPagerAdapter(getSupportFragmentManager(), getLifecycle());
        viewPager.setAdapter(pagerAdapter);

        // TabLayout setup
        TabLayout tabLayout = findViewById(R.id.tabLayout);
        new TabLayoutMediator(tabLayout, viewPager, (tab, position) -> {
            if (position == 0) {
                tab.setText("Home");
            } else if (position == 1) {
                tab.setText("My Plans");
            }
        }).attach();

        // Bottom Navigation Bar setup
        bottomNavigationView = findViewById(R.id.bottomNavigationView);

        // ViewPager Page Change Listener
        viewPager.registerOnPageChangeCallback(new ViewPager2.OnPageChangeCallback() {
            @Override
            public void onPageSelected(int position) {
                super.onPageSelected(position);

                // Update BottomNavigationView when ViewPager page changes
                bottomNavigationView.setSelectedItemId(getBottomNavId(position));
            }
        });

        // Bottom Navigation Bar Item Selected Listener
        bottomNavigationView.setOnItemSelectedListener(item -> {
            int itemId = item.getItemId();
            int position = -1;

            // Update ViewPager when BottomNavigationView item changes
            if (itemId == R.id.menu_home) {
                position = 0;
            } else if (itemId == R.id.menu_my_plans) {
                position = 1;
            }
            // Add else-if conditions for additional BottomNavigationView items if needed

            if (position != -1) {
                viewPager.setCurrentItem(position, true);
                return true;
            }

            return false;
        });
    }

    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        getMenuInflater().inflate(R.menu.menu_client, menu);
        return true;
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        if (item.getItemId() == R.id.action_profile) {
            // Handle profile item click (open profile activity)
            showProfileActivity();
            return true;
        }
        if (item.getItemId() == R.id.action_Wedding) {
            // Handle profile item click (open profile activity)
            showWedingActivity();
            return true;
        }
        return super.onOptionsItemSelected(item);
    }

    private void showProfileActivity() {
        // Create an Intent to start the ClientProfileActivity
        Intent intent = new Intent(this, ClientProfileActivity.class);
        startActivity(intent);
    }

    private void showWedingActivity() {
        // Create an Intent to start the ClientProfileActivity
        Intent intent = new Intent(this, ShowWeddingActivity.class);
        startActivity(intent);
    }

    private int getBottomNavId(int position) {
        if (position == 0) {
            return R.id.menu_home;
        } else if (position == 1) {
            return R.id.menu_my_plans;
        }
        // Add else-if conditions for additional ViewPager fragments if needed
        return -1; // Invalid ID, handle accordingly
    }
}
