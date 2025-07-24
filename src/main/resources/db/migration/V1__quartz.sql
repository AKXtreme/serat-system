BEGIN;

-- Drop existing tables
DROP TABLE IF EXISTS QRTZ_FIRED_TRIGGERS;
DROP TABLE IF EXISTS QRTZ_PAUSED_TRIGGER_GRPS;
DROP TABLE IF EXISTS QRTZ_SCHEDULER_STATE;
DROP TABLE IF EXISTS QRTZ_LOCKS;
DROP TABLE IF EXISTS QRTZ_SIMPLE_TRIGGERS;
DROP TABLE IF EXISTS QRTZ_SIMPROP_TRIGGERS;
DROP TABLE IF EXISTS QRTZ_CRON_TRIGGERS;
DROP TABLE IF EXISTS QRTZ_BLOB_TRIGGERS;
DROP TABLE IF EXISTS QRTZ_TRIGGERS;
DROP TABLE IF EXISTS QRTZ_JOB_DETAILS;
DROP TABLE IF EXISTS QRTZ_CALENDARS;

-- ----------------------------
-- 1. Stores details for each configured jobDetail
-- ----------------------------
CREATE TABLE QRTZ_JOB_DETAILS (
    sched_name           VARCHAR(120)    NOT NULL,
    job_name             VARCHAR(200)    NOT NULL,
    job_group            VARCHAR(200)    NOT NULL,
    description          VARCHAR(250),
    job_class_name       VARCHAR(250)    NOT NULL,
    is_durable           VARCHAR(1)      NOT NULL,
    is_nonconcurrent     VARCHAR(1)      NOT NULL,
    is_update_data       VARCHAR(1)      NOT NULL,
    requests_recovery    VARCHAR(1)      NOT NULL,
    job_data             BYTEA,
    PRIMARY KEY (sched_name, job_name, job_group)
);
-- ----------------------------
-- 2. Stores information about configured Triggers
-- ----------------------------
CREATE TABLE QRTZ_TRIGGERS (
    sched_name           VARCHAR(120)    NOT NULL,
    trigger_name         VARCHAR(200)    NOT NULL,
    trigger_group        VARCHAR(200)    NOT NULL,
    job_name             VARCHAR(200)    NOT NULL,
    job_group            VARCHAR(200)    NOT NULL,
    description          VARCHAR(250),
    next_fire_time       BIGINT,
    prev_fire_time       BIGINT,
    priority             INTEGER,
    trigger_state        VARCHAR(16)     NOT NULL,
    trigger_type         VARCHAR(8)      NOT NULL,
    start_time           BIGINT          NOT NULL,
    end_time             BIGINT,
    calendar_name        VARCHAR(200),
    misfire_instr        SMALLINT,
    job_data             BYTEA,
    PRIMARY KEY (sched_name, trigger_name, trigger_group),
    FOREIGN KEY (sched_name, job_name, job_group) REFERENCES QRTZ_JOB_DETAILS (sched_name, job_name, job_group)
);
-- ----------------------------
-- 3. Store a simple Trigger, including the number of repetitions, the interval, and the number of times it has been triggered
-- ----------------------------
CREATE TABLE QRTZ_SIMPLE_TRIGGERS (
    sched_name           VARCHAR(120)    NOT NULL,
    trigger_name         VARCHAR(200)    NOT NULL,
    trigger_group        VARCHAR(200)    NOT NULL,
    repeat_count         BIGINT          NOT NULL,
    repeat_interval      BIGINT          NOT NULL,
    times_triggered      BIGINT          NOT NULL,
    PRIMARY KEY (sched_name, trigger_name, trigger_group),
    FOREIGN KEY (sched_name, trigger_name, trigger_group) REFERENCES QRTZ_TRIGGERS (sched_name, trigger_name, trigger_group)
);
-- ----------------------------
-- 4. Stores Cron Triggers, including Cron expressions and time zone information
-- ----------------------------
CREATE TABLE QRTZ_CRON_TRIGGERS (
    sched_name           VARCHAR(120)    NOT NULL,
    trigger_name         VARCHAR(200)    NOT NULL,
    trigger_group        VARCHAR(200)    NOT NULL,
    cron_expression      VARCHAR(200)    NOT NULL,
    time_zone_id         VARCHAR(80),
    PRIMARY KEY (sched_name, trigger_name, trigger_group),
    FOREIGN KEY (sched_name, trigger_name, trigger_group) REFERENCES QRTZ_TRIGGERS (sched_name, trigger_name, trigger_group)
);
-- ----------------------------
-- 5. Trigger as Blob type storage(used for Quartz For users JDBC Create their own customized Trigger type，JobStore When you don’t know how to store instances)
-- ----------------------------
CREATE TABLE QRTZ_BLOB_TRIGGERS (
    sched_name           VARCHAR(120)    NOT NULL,
    trigger_name         VARCHAR(200)    NOT NULL,
    trigger_group        VARCHAR(200)    NOT NULL,
    blob_data            BYTEA,
    PRIMARY KEY (sched_name, trigger_name, trigger_group),
    FOREIGN KEY (sched_name, trigger_name, trigger_group) REFERENCES QRTZ_TRIGGERS (sched_name, trigger_name, trigger_group)
);
-- ----------------------------
-- 6. Calendar information is stored in Blob type. quartz can configure a calendar to specify a time range.
-- ----------------------------
CREATE TABLE QRTZ_CALENDARS (
    sched_name           VARCHAR(120)    NOT NULL,
    calendar_name        VARCHAR(200)    NOT NULL,
    calendar             BYTEA           NOT NULL,
    PRIMARY KEY (sched_name, calendar_name)
);
-- ----------------------------
-- 7. Stores information about paused Trigger groups
-- ----------------------------
CREATE TABLE QRTZ_PAUSED_TRIGGER_GRPS (
    sched_name           VARCHAR(120)    NOT NULL,
    trigger_group        VARCHAR(200)    NOT NULL,
    PRIMARY KEY (sched_name, trigger_group)
);
-- ----------------------------
-- 8. Store status information related to the triggered Trigger and execution information of the associated Job
-- ----------------------------
CREATE TABLE QRTZ_FIRED_TRIGGERS (
    sched_name           VARCHAR(120)    NOT NULL,
    entry_id             VARCHAR(95)     NOT NULL,
    trigger_name         VARCHAR(200)    NOT NULL,
    trigger_group        VARCHAR(200)    NOT NULL,
    instance_name        VARCHAR(200)    NOT NULL,
    fired_time           BIGINT          NOT NULL,
    sched_time           BIGINT          NOT NULL,
    priority             INTEGER         NOT NULL,
    state                VARCHAR(16)     NOT NULL,
    job_name             VARCHAR(200),
    job_group            VARCHAR(200),
    is_nonconcurrent     VARCHAR(1),
    requests_recovery    VARCHAR(1),
    PRIMARY KEY (sched_name, entry_id)
);

-- ----------------------------
-- 9. Store a small amount of status information about Scheduler. If it is used in a cluster, you can see other Scheduler instances.
-- ----------------------------
CREATE TABLE QRTZ_SCHEDULER_STATE (
    sched_name           VARCHAR(120)    NOT NULL,
    instance_name        VARCHAR(200)    NOT NULL,
    last_checkin_time    BIGINT          NOT NULL,
    checkin_interval     BIGINT          NOT NULL,
    PRIMARY KEY (sched_name, instance_name)
);

-- ----------------------------
-- 10. Store the pessimistic lock information of the program (if pessimistic lock is used)
-- ----------------------------
CREATE TABLE QRTZ_LOCKS (
    sched_name           VARCHAR(120)    NOT NULL,
    lock_name            VARCHAR(40)     NOT NULL,
    PRIMARY KEY (sched_name, lock_name)
);

-- ----------------------------
-- 11. Quartz cluster implements row lock table of synchronization mechanism
-- ----------------------------
CREATE TABLE QRTZ_SIMPROP_TRIGGERS (
    sched_name           VARCHAR(120)    NOT NULL,
    trigger_name         VARCHAR(200)    NOT NULL,
    trigger_group        VARCHAR(200)    NOT NULL,
    str_prop_1           VARCHAR(512),
    str_prop_2           VARCHAR(512),
    str_prop_3           VARCHAR(512),
    int_prop_1           INT,
    int_prop_2           INT,
    long_prop_1          BIGINT,
    long_prop_2          BIGINT,
    dec_prop_1           NUMERIC(13,4),
    dec_prop_2           NUMERIC(13,4),
    bool_prop_1          VARCHAR(1),
    bool_prop_2          VARCHAR(1),
    PRIMARY KEY (sched_name, trigger_name, trigger_group),
    FOREIGN KEY (sched_name, trigger_name, trigger_group) REFERENCES QRTZ_TRIGGERS (sched_name, trigger_name, trigger_group)
);
COMMIT;