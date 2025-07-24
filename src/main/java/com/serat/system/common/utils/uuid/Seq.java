package com.serat.system.common.utils.uuid;

import com.serat.system.common.utils.DateUtils;
import com.serat.system.common.utils.StringUtils;

import java.util.concurrent.atomic.AtomicInteger;

public class Seq
{
    public static final String commSeqType = "COMMON";

    public static final String uploadSeqType = "UPLOAD";

    private static AtomicInteger commSeq = new AtomicInteger(1);

    private static AtomicInteger uploadSeq = new AtomicInteger(1);

    private static final String machineCode = "A";

    public static String getId()
    {
        return getId(commSeqType);
    }

    public static String getId(String type)
    {
        AtomicInteger atomicInt = commSeq;
        if (uploadSeqType.equals(type))
        {
            atomicInt = uploadSeq;
        }
        return getId(atomicInt, 3);
    }

    public static String getId(AtomicInteger atomicInt, int length)
    {
        String result = DateUtils.dateTimeNow();
        result += machineCode;
        result += getSeq(atomicInt, length);
        return result;
    }

    private synchronized static String getSeq(AtomicInteger atomicInt, int length)
    {
        int value = atomicInt.getAndIncrement();

        int maxSeq = (int) Math.pow(10, length);
        if (atomicInt.get() >= maxSeq)
        {
            atomicInt.set(1);
        }
        return StringUtils.padl(value, length);
    }
}
