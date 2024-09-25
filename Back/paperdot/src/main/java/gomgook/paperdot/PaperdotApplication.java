package gomgook.paperdot;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;

@SpringBootApplication
@EnableCaching
public class PaperdotApplication {

	public static void main(String[] args) {
		SpringApplication.run(PaperdotApplication.class, args);
	}

}
