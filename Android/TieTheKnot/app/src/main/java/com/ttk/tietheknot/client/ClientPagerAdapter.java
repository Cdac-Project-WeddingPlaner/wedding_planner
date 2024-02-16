// ClientPagerAdapter.java

package com.ttk.tietheknot.client;

import androidx.annotation.NonNull;
import androidx.fragment.app.Fragment;
import androidx.fragment.app.FragmentManager;
import androidx.lifecycle.Lifecycle;
import androidx.viewpager2.adapter.FragmentStateAdapter;

public class ClientPagerAdapter extends FragmentStateAdapter {

    public ClientPagerAdapter(@NonNull FragmentManager fragmentManager, @NonNull Lifecycle lifecycle) {
        super(fragmentManager, lifecycle);
    }

    @NonNull
    @Override
    public Fragment createFragment(int position) {
        switch (position) {
            case 0:
                return new ClientHomeFrag();
            case 1:
                return new ClientMyPlanFrag();
            default:
                throw new IllegalArgumentException("Invalid position: " + position);
        }
    }

    @Override
    public int getItemCount() {
        return 2; // Number of fragments
    }

    @NonNull

    public CharSequence getPageTitle(int position) {
        // Provide page titles for the TabLayout
        switch (position) {
            case 0:
                return "Home";
            case 1:
                return "My Plans";
            default:
                return "";
        }
    }
}
