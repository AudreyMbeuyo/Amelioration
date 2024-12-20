package com.mycompany.myapp.domain;

import java.util.Random;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicLong;

public class MatiereTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    public static Matiere getMatiereSample1() {
        return new Matiere().id(1L).libelle("libelle1").code("code1");
    }

    public static Matiere getMatiereSample2() {
        return new Matiere().id(2L).libelle("libelle2").code("code2");
    }

    public static Matiere getMatiereRandomSampleGenerator() {
        return new Matiere().id(longCount.incrementAndGet()).libelle(UUID.randomUUID().toString()).code(UUID.randomUUID().toString());
    }
}
