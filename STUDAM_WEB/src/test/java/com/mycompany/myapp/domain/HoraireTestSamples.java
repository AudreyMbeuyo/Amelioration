package com.mycompany.myapp.domain;

import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;

public class HoraireTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    public static Horaire getHoraireSample1() {
        return new Horaire().id(1L);
    }

    public static Horaire getHoraireSample2() {
        return new Horaire().id(2L);
    }

    public static Horaire getHoraireRandomSampleGenerator() {
        return new Horaire().id(longCount.incrementAndGet());
    }
}
