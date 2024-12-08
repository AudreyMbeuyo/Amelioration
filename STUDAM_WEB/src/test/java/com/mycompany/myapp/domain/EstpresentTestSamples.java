package com.mycompany.myapp.domain;

import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;

public class EstpresentTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    public static Estpresent getEstpresentSample1() {
        return new Estpresent().id(1L);
    }

    public static Estpresent getEstpresentSample2() {
        return new Estpresent().id(2L);
    }

    public static Estpresent getEstpresentRandomSampleGenerator() {
        return new Estpresent().id(longCount.incrementAndGet());
    }
}
