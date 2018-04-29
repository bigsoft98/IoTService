package me.hukun.unimelb.project.IoTService.persistant.repository;


import java.util.List;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import me.hukun.unimelb.project.IoTService.domain.Sensor;
@Repository
public interface SensorRepository extends MongoRepository<Sensor, String>{
	

	@Query("{id:'?0'}")
	public List<Sensor> findSensorById(String id);

	
	//List<Device> devices = userRepository.findAll(new Sort(Sort.Direction.ASC, "name"));

	

}