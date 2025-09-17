package com.feminine.api.domain;

import jakarta.persistence.CascadeType;
import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Entity
@Table(name = "photographer_profiles")
public class PhotographerProfile extends BaseEntity {

    @Column(name = "full_name", nullable = false)
    private String fullName;

    @Column(length = 2048)
    private String bio;

    @Column(nullable = false, unique = true)
    private String email;

    private String phone;

    private String location;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "photographer_specialties", joinColumns = @JoinColumn(name = "photographer_id"))
    @Column(name = "specialty")
    private Set<String> specialties = new HashSet<>();

    @Column(name = "starting_price")
    private BigDecimal startingPrice;

    private Double rating;

    @OneToMany(mappedBy = "photographer", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Album> albums = new ArrayList<>();

    @OneToMany(mappedBy = "photographer", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Inquiry> inquiries = new ArrayList<>();

    @OneToMany(mappedBy = "photographer", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Booking> bookings = new ArrayList<>();

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getBio() {
        return bio;
    }

    public void setBio(String bio) {
        this.bio = bio;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public Set<String> getSpecialties() {
        return specialties;
    }

    public void setSpecialties(Set<String> specialties) {
        this.specialties = specialties;
    }

    public BigDecimal getStartingPrice() {
        return startingPrice;
    }

    public void setStartingPrice(BigDecimal startingPrice) {
        this.startingPrice = startingPrice;
    }

    public Double getRating() {
        return rating;
    }

    public void setRating(Double rating) {
        this.rating = rating;
    }

    public List<Album> getAlbums() {
        return albums;
    }

    public void setAlbums(List<Album> albums) {
        this.albums = albums;
    }

    public List<Inquiry> getInquiries() {
        return inquiries;
    }

    public void setInquiries(List<Inquiry> inquiries) {
        this.inquiries = inquiries;
    }

    public List<Booking> getBookings() {
        return bookings;
    }

    public void setBookings(List<Booking> bookings) {
        this.bookings = bookings;
    }
}
