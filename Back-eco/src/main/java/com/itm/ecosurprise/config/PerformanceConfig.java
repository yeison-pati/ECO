package com.itm.ecosurprise.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor;
import org.springframework.web.servlet.config.annotation.AsyncSupportConfigurer;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;


@Configuration
public class PerformanceConfig implements WebMvcConfigurer {

    /**
     * Configuración de thread pool optimizado para baja memoria
     */
    @Bean(name = "taskExecutor")
    public ThreadPoolTaskExecutor taskExecutor() {
        ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();
        
        // Configuración conservadora de memoria
        executor.setCorePoolSize(2);
        executor.setMaxPoolSize(4);
        executor.setQueueCapacity(50);
        executor.setThreadNamePrefix("EcoSurprise-");
        
        // Configuración para liberar threads inactivos rápidamente
        executor.setKeepAliveSeconds(60);
        executor.setAllowCoreThreadTimeOut(true);
        
        executor.initialize();
        return executor;
    }

    /**
     * Configuración de async support con timeout corto
     */
    @Override
    public void configureAsyncSupport(AsyncSupportConfigurer configurer) {
        configurer.setDefaultTimeout(30000); // 30 segundos
        configurer.setTaskExecutor(taskExecutor());
    }
}