package me.hukun.unimelb.project.IoTService.persistant.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import me.hukun.unimelb.project.IoTService.domain.Logic;

@Repository
public interface LogicRepository extends MongoRepository<Logic, String>{

	@Query("{id:'?0'}")
	public List<Logic> findLogicById(String id);
	@Query("{sensorId:'?0'}")
	public List<Logic> findLogicBySensorId(String sensorId);


}
