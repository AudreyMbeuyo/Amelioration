package com.mycompany.myapp.domain;

import java.util.Random;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicLong;

public class EnseignantTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    public static Enseignant getEnseignantSample1() {
        return new Enseignant().id(1L).nom("nom1").email("email1").password("password1");
    }

    public static Enseignant getEnseignantSample2() {
        return new Enseignant().id(2L).nom("nom2").email("email2").password("password2");
    }

    public static Enseignant getEnseignantRandomSampleGenerator() {
        return new Enseignant()
            .id(longCount.incrementAndGet())
            .nom(UUID.randomUUID().toString())
            .email(UUID.randomUUID().toString())
            .password(UUID.randomUUID().toString());
    }
}
