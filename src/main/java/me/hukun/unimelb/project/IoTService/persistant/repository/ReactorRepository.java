package me.hukun.unimelb.project.IoTService.persistant.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import me.hukun.unimelb.project.IoTService.domain.Reactor;

public interface ReactorRepository extends MongoRepository<Reactor, String>{
	
	
	// find reactor in db by reactor id
	@Query("{id:'?0'}")
	public List<Reactor> findReactorById(String id);


}
