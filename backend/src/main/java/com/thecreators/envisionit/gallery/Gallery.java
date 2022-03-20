package com.thecreators.envisionit;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document("galleries")
public class Gallery {

	@Id
	private String galleryId;
	private String title;
    private String creator;
	private Date creationDate = new Date();

	public String getGalleryId() {
		return galleryId;
	}

	public void setGalleryId(String galleryId) {
		this.galleryId = galleryId;
	}

	public String getTitle() {
		return title;
	}

	public void setTitle(String title) {
		this.title = title;
	}

    public String getCreator() {
		return creator;
	}

	public void setCreator(String creator) {
		this.creator = creator;
	}

	public Date getCreationDate() {
		return creationDate;
	}

	public void setCreationDate(Date creationDate) {
		this.creationDate = creationDate;
	}
}