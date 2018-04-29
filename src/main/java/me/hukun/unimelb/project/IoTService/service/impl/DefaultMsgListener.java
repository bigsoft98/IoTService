package me.hukun.unimelb.project.IoTService.service.impl;

import javax.jms.JMSException;
import javax.jms.Message;
import javax.jms.MessageListener;
import javax.jms.TextMessage;

import org.apache.log4j.Logger;

public class DefaultMsgListener implements MessageListener{
	
	private static final Logger logger = Logger.getLogger(DefaultMsgListener.class);
	
	public void onMessage(Message msg) {
	
		if (msg instanceof TextMessage){

			try {
				String messageString = ((TextMessage)msg).getText();
				logger.debug("Incoming msg --- "+messageString);

			} catch (JMSException e) {
				logger.error(e.getMessage());
			}
		}
	}

}
