package com.feminine.api.audit;

import jakarta.annotation.Priority;
import jakarta.interceptor.AroundInvoke;
import jakarta.interceptor.Interceptor;
import jakarta.interceptor.InvocationContext;
import org.jboss.logging.Logger;

import java.util.Arrays;

@Audited
@Interceptor
@Priority(Interceptor.Priority.APPLICATION)
public class AuditInterceptor {

    private static final Logger LOGGER = Logger.getLogger(AuditInterceptor.class);

    @AroundInvoke
    public Object audit(InvocationContext context) throws Exception {
        long start = System.currentTimeMillis();
        try {
            LOGGER.infof("Audit start %s#%s args=%s", context.getTarget().getClass().getSimpleName(),
                    context.getMethod().getName(), Arrays.toString(context.getParameters()));
            Object result = context.proceed();
            long duration = System.currentTimeMillis() - start;
            LOGGER.infof("Audit success %s#%s duration=%dms", context.getTarget().getClass().getSimpleName(),
                    context.getMethod().getName(), duration);
            return result;
        } catch (Exception ex) {
            LOGGER.errorf(ex, "Audit failure %s#%s", context.getTarget().getClass().getSimpleName(),
                    context.getMethod().getName());
            throw ex;
        }
    }
}
