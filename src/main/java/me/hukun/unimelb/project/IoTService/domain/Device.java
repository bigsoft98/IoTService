package me.hukun.unimelb.project.IoTService.domain;


public class Device {
	
	String name;
	String description;
	String location;
	
	//mqtt or http
	String communicateChannel;
	
	
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getDescription() {
		return description;
	}
	public void setDescription(String description) {
		this.description = description;
	}
	public String getLocation() {
		return location;
	}
	public void setLocation(String location) {
		this.location = location;
	}
	public String getCommunicateChannel() {
		return communicateChannel;
	}
	public void setCommunicateChannel(String communicateChannel) {
		this.communicateChannel = communicateChannel;
	}
}
