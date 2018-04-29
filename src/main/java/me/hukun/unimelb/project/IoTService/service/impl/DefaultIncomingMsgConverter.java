package me.hukun.unimelb.project.IoTService.service.impl;

import javax.jms.JMSException;
import javax.jms.Message;
import javax.jms.Session;
import javax.jms.TextMessage;

import org.apache.log4j.Logger;
import org.springframework.jms.support.converter.MessageConversionException;
import org.springframework.jms.support.converter.MessageConverter;

public class DefaultIncomingMsgConverter implements MessageConverter{

	
	private static final Logger logger = Logger.getLogger(DefaultIncomingMsgConverter.class);
	
	public Object fromMessage(Message msg) throws JMSException, MessageConversionException {
		
		logger.debug("fromMessage: "+ ((TextMessage)msg).getText());
		
		return ((TextMessage)msg).getText();
	}

	public Message toMessage(Object object, Session session) throws JMSException, MessageConversionException {
		
		return null;
	}

}
