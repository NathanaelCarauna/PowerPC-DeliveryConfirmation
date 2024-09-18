package com.powerpc.PowerPCDelivery.model;

public enum Role {
	ADMIN("admin");

	private String role;

	Role(String role) {
		this.role = role;
	}

	public String getRole() {
		return role;
	}
}
