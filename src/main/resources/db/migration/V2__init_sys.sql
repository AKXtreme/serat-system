Begin;

-- Drop all sys tables
DROP TABLE IF EXISTS sys_dept;
DROP TABLE IF EXISTS sys_user_role;
DROP TABLE IF EXISTS sys_role_menu;
DROP TABLE IF EXISTS sys_role_dept;
DROP TABLE IF EXISTS sys_role;
DROP TABLE IF EXISTS sys_menu;
DROP TABLE IF EXISTS sys_user_post;
DROP TABLE IF EXISTS sys_post;
DROP TABLE IF EXISTS sys_oper_log;
DROP TABLE IF EXISTS sys_dict_type;
DROP TABLE IF EXISTS sys_dict_data;
DROP TABLE IF EXISTS sys_config;
DROP TABLE IF EXISTS sys_notice;
DROP TABLE IF EXISTS sys_logininfor;
DROP TABLE IF EXISTS sys_user;
DROP TABLE IF EXISTS sys_job;
DROP TABLE IF EXISTS sys_job_log;
-- 1. Department Table
CREATE TABLE sys_dept (
    dept_id           SERIAL      NOT NULL PRIMARY KEY,
    parent_id         BIGINT         DEFAULT 0,
    ancestors         VARCHAR(50)    DEFAULT '',
    dept_name         VARCHAR(30)    DEFAULT '',
    order_num         INT            DEFAULT 0,
    leader            VARCHAR(20),
    phone             VARCHAR(11),
    email             VARCHAR(50),
    status            CHAR(1)        DEFAULT '0',
    del_flag          CHAR(1)        DEFAULT '0',
    create_by         VARCHAR(64)    DEFAULT '',
    create_time       TIMESTAMP,
    update_by         VARCHAR(64)    DEFAULT '',
    update_time       TIMESTAMP
);

-- Initialize - Department Table Data
INSERT INTO sys_dept VALUES
(100,  0,   '0',          'AMap',        0, 'NP', '15888888888', 'np@aii.et', '0', '0', 'admin', CURRENT_TIMESTAMP, '', null),
(101,  100, '0,100',      'Ticket Management',   1, 'NP', '15888888888', 'np@aii.et', '0', '0', 'admin', CURRENT_TIMESTAMP, '', null),
(102,  100, '0,100',      'Visitors management',         2, 'NP', '15888888888', 'np@aii.et', '0', '0', 'admin', CURRENT_TIMESTAMP, '', null),
(103,  101, '0,100,101',  'Ticket Creation Department',          1, 'NP', '15888888888', 'np@aii.et', '0', '0', 'admin', CURRENT_TIMESTAMP, '', null),
(104,  101, '0,100,101',  'Marketing Department',    2, 'NP', '15888888888', 'np@aii.et', '0', '0', 'admin', CURRENT_TIMESTAMP, '', null),
(105,  101, '0,100,101',  'Testing Department',      3, 'NP', '15888888888', 'np@aii.et', '0', '0', 'admin', CURRENT_TIMESTAMP, '', null),
(106,  101, '0,100,101',  'Finance Department',      4, 'NP', '15888888888', 'np@aii.et', '0', '0', 'admin', CURRENT_TIMESTAMP, '', null),
(107,  101, '0,100,101',  'Operations Department',   5, 'NP', '15888888888', 'np@aii.et', '0', '0', 'admin', CURRENT_TIMESTAMP, '', null),
(108,  102, '0,100,102',  'Ticket Validation Department',    1, 'NP', '15888888888', 'np@aii.et', '0', '0', 'admin', CURRENT_TIMESTAMP, '', null),
(109,  102, '0,100,102',  'Customer Service Department',      2, 'NP', '15888888888', 'np@aii.et', '0', '0', 'admin', CURRENT_TIMESTAMP, '', null);

-- This will make the table to generate auto dep_id of current max dep_id + 2
SELECT setval(pg_get_serial_sequence('sys_dept', 'dept_id'), (SELECT MAX(dept_id) FROM sys_dept));

-- 2. User Information Table
CREATE TABLE sys_user (
    user_id           SERIAL      NOT NULL PRIMARY KEY,
    dept_id           BIGINT         DEFAULT NULL,
    user_name         VARCHAR(30)    NOT NULL,
    nick_name         VARCHAR(30)    NOT NULL,
    user_type         VARCHAR(2)     DEFAULT '00',
    email             VARCHAR(50)    DEFAULT '',
    phonenumber       VARCHAR(11)    DEFAULT '',
    sex               CHAR(1)        DEFAULT '0',
    avatar            VARCHAR(100)   DEFAULT '',
    password          VARCHAR(100)   DEFAULT '',
    status            CHAR(1)        DEFAULT '0',
    del_flag          CHAR(1)        DEFAULT '0',
    login_ip          VARCHAR(128)   DEFAULT '',
    login_date        TIMESTAMP,
    create_by         VARCHAR(64)    DEFAULT '',
    create_time       TIMESTAMP,
    update_by         VARCHAR(64)    DEFAULT '',
    update_time       TIMESTAMP,
    remark            VARCHAR(500)
);

-- Initialize - User Information Table Data
INSERT INTO sys_user VALUES
(1,  103, 'admin', 'National map', '00', 'np@aii.et', '15888888888', '1', '', '$2a$10$7JB720yubVSZvUI0rEqK/.VqGOZTH.ulu33dHOiBE8ByOhJIrdAu2', '0', '0', '127.0.0.1', CURRENT_TIMESTAMP, 'admin', CURRENT_TIMESTAMP, '', NULL, 'Administrator');

-- This will make the table to generate auto user_id of current max user_id + 2
SELECT setval(pg_get_serial_sequence('sys_user', 'user_id'), (SELECT MAX(user_id) FROM sys_user));

-- 3. Position Information Table
CREATE TABLE sys_post (
    post_id       SERIAL      NOT NULL PRIMARY KEY,
    post_code     VARCHAR(64)    NOT NULL,
    post_name     VARCHAR(50)    NOT NULL,
    post_sort     INT            NOT NULL,
    status        CHAR(1)        NOT NULL,
    create_by     VARCHAR(64)    DEFAULT '',
    create_time   TIMESTAMP,
    update_by     VARCHAR(64)    DEFAULT '',
    update_time   TIMESTAMP,
    remark        VARCHAR(500)
);

-- Initialize - Position Information Table Data
INSERT INTO sys_post VALUES
(1, 'ceo',  'Chairman',           1, '0', 'admin', CURRENT_TIMESTAMP, '', null, ''),
(2, 'se',   'Project Manager',    2, '0', 'admin', CURRENT_TIMESTAMP, '', null, ''),
(3, 'hr',   'Human Resources',    3, '0', 'admin', CURRENT_TIMESTAMP, '', null, ''),
(4, 'user', 'Ordinary Employee',  4, '0', 'admin', CURRENT_TIMESTAMP, '', null, '');

SELECT setval(pg_get_serial_sequence('sys_post', 'post_id'), (SELECT MAX(post_id) FROM sys_post));

-- 4. Role Information Table
CREATE TABLE sys_role (
    role_id              SERIAL      NOT NULL PRIMARY KEY,
    role_name            VARCHAR(30)    NOT NULL,
    role_key             VARCHAR(100)   NOT NULL,
    role_sort            INT            NOT NULL,
    data_scope           CHAR(1)        DEFAULT '1',
    menu_check_strictly  SMALLINT       DEFAULT 1,
    dept_check_strictly  SMALLINT       DEFAULT 1,
    status               CHAR(1)        NOT NULL,
    del_flag             CHAR(1)        DEFAULT '0',
    create_by            VARCHAR(64)    DEFAULT '',
    create_time          TIMESTAMP,
    update_by            VARCHAR(64)    DEFAULT '',
    update_time          TIMESTAMP,
    remark               VARCHAR(500)
);

-- Initialize - Role Information Table Data
INSERT INTO sys_role VALUES
(1, 'Super Administrator', 'admin',  1, '1', 1, 1, '0', '0', 'admin', CURRENT_TIMESTAMP, '', null, 'Super Administrator');

SELECT setval(pg_get_serial_sequence('sys_role', 'role_id'), (SELECT MAX(role_id) FROM sys_role));

-- 5. Menu Permissions Table
CREATE TABLE sys_menu (
    menu_id           SERIAL      NOT NULL PRIMARY KEY,
    menu_name         VARCHAR(50)    NOT NULL,
    parent_id         BIGINT         DEFAULT 0,
    order_num         INT            DEFAULT 0,
    path              VARCHAR(200)   DEFAULT '',
    component         VARCHAR(255),
    query             VARCHAR(255),
    route_name        VARCHAR(50)    DEFAULT '',
    is_frame          SMALLINT       DEFAULT 1,
    is_cache          SMALLINT       DEFAULT 0,
    menu_type         CHAR(1)        DEFAULT '',
    visible           CHAR(1)        DEFAULT '0',
    status            CHAR(1)        DEFAULT '0',
    perms             VARCHAR(100),
    icon              VARCHAR(100)   DEFAULT '#',
    create_by         VARCHAR(64)    DEFAULT '',
    create_time       TIMESTAMP,
    update_by         VARCHAR(64)    DEFAULT '',
    update_time       TIMESTAMP,
    remark            VARCHAR(500)   DEFAULT ''
);

-- Level 1 Menu
INSERT INTO sys_menu VALUES
(1,  'System Management',      0, 1, 'system',           NULL, '', '', 1, 0, 'M', '0', '0', '', 'system',        'admin', CURRENT_TIMESTAMP, '', NULL, 'System Management Directory'),
(2,  'System Monitoring',      0, 2, 'monitor',          NULL, '', '', 1, 0, 'M', '0', '0', '', 'monitor',       'admin', CURRENT_TIMESTAMP, '', NULL, 'System Monitoring Directory');

-- Secondary Menu
INSERT INTO sys_menu VALUES
(100, 'User Management',          1, 1,  'user',           'system/user/index',      '', '', 1, 0, 'C', '0', '0', 'system:user:list',      'user',       'admin', CURRENT_TIMESTAMP, '', NULL, 'User Management Menu'),
(101, 'Role Management',          1, 2,  'role',           'system/role/index',      '', '', 1, 0, 'C', '0', '0', 'system:role:list',      'peoples',    'admin', CURRENT_TIMESTAMP, '', NULL, 'Role Management Menu'),
(102, 'Menu Management',          1, 3,  'menu',           'system/menu/index',      '', '', 1, 0, 'C', '0', '0', 'system:menu:list',      'tree-table', 'admin', CURRENT_TIMESTAMP, '', NULL, 'Menu Management Menu'),
(103, 'Department Management',    1, 4,  'dept',           'system/dept/index',      '', '', 1, 0, 'C', '0', '0', 'system:dept:list',      'tree',       'admin', CURRENT_TIMESTAMP, '', NULL, 'Department Management Menu'),
(104, 'Position Management',      1, 5,  'post',           'system/post/index',      '', '', 1, 0, 'C', '0', '0', 'system:post:list',      'post',       'admin', CURRENT_TIMESTAMP, '', NULL, 'Position Management Menu'),
(105, 'Dictionary Management',    1, 6,  'dict',           'system/dict/index',      '', '', 1, 0, 'C', '0', '0', 'system:dict:list',      'dict',       'admin', CURRENT_TIMESTAMP, '', NULL, 'Dictionary Management Menu'),
(106, 'Parameter Settings',       1, 7,  'config',         'system/config/index',    '', '', 1, 0, 'C', '0', '0', 'system:config:list',    'edit',       'admin', CURRENT_TIMESTAMP, '', NULL, 'Parameter Settings Menu'),
(107, 'Notice and Announcements', 1, 8,  'notice',         'system/notice/index',    '', '', 1, 0, 'C', '0', '0', 'system:notice:list',    'message',    'admin', CURRENT_TIMESTAMP, '', NULL, 'Notice and Announcements Menu'),
(108, 'Log Management',           1, 9,  'log',            '',                       '', '', 1, 0, 'M', '0', '0', '',                   'log',        'admin', CURRENT_TIMESTAMP, '', NULL, 'Log Management Menu'),
(109, 'Field',                    1, 10, 'field',          'system/field/index',     '', '', 1, 0, 'C', '0', '0', 'system:field:list',     'drag',       'admin', CURRENT_TIMESTAMP, '', NULL, 'Field Management Menu'),
(110, 'OSS',                      1, 11, 'oss',            'system/oss/index',       '', '', 1, 0, 'C', '0', '0', 'system:oss:list',       'component',  'admin', CURRENT_TIMESTAMP, '', NULL, 'OSS Menu'),
(111, 'OSS Configuration',        1, 12, 'ossConfig',      'system/config/index',    '', '', 1, 0, 'C', '0', '0', 'system:config:list',    'component',  'admin', CURRENT_TIMESTAMP, '', NULL, 'OSS Configuration Menu'),
(112, 'Parameter',                1, 13, 'param',          'system/param/index',     '', '', 1, 0, 'C', '0', '0', 'system:param:list',     'edit',       'admin', CURRENT_TIMESTAMP, '', NULL, 'Parameters Menu'),
(113, 'Query User',               1, 14, 'queryuser',      'system/queryuser/index', '', '', 1, 0, 'M', '0', '0', 'system:queryuser:list', 'peoples',    'admin', CURRENT_TIMESTAMP, '', NULL, 'Query Users Menu');

-- Additional Menu Data for Monitoring (Level 2)
INSERT INTO sys_menu VALUES
(120, 'Online Users',       2, 1, 'online',        'monitor/online/index',       '', '', 1, 0, 'C', '0', '0', 'monitor:online:list',     'online',      'admin', CURRENT_TIMESTAMP, '', NULL, 'Online Users Menu'),
(121, 'Scheduled Tasks',    2, 2, 'job',           'monitor/job/index',          '', '', 1, 0, 'C', '0', '0', 'monitor:job:list',        'job',         'admin', CURRENT_TIMESTAMP, '', NULL, 'Scheduled Tasks Menu'),
(122, 'Data Monitoring',    2, 3, 'druid',         'monitor/druid/index',        '', '', 1, 0, 'C', '0', '0', 'monitor:druid:list',      'druid',       'admin', CURRENT_TIMESTAMP, '', NULL, 'Data Monitoring Menu'),
(123, 'Server Monitoring',  2, 4, 'server',        'monitor/server/index',       '', '', 1, 0, 'C', '0', '0', 'monitor:server:list',     'server',      'admin', CURRENT_TIMESTAMP, '', NULL, 'Server Monitoring Menu'),
(124, 'Cache Monitoring',   2, 5, 'cache',         'monitor/cache/index',        '', '', 1, 0, 'C', '0', '0', 'monitor:cache:list',      'redis',       'admin', CURRENT_TIMESTAMP, '', NULL, 'Cache Monitoring Menu'),
(125, 'Cache List',         2, 6, 'cacheList',     'monitor/cache/list',         '', '', 1, 0, 'C', '0', '0', 'monitor:cache:list',      'redis-list',  'admin', CURRENT_TIMESTAMP, '', NULL, 'Cache List Menu');

-- Tertiary Menu Data for Logs (Level 3)
INSERT INTO sys_menu VALUES
(500, 'Operation Log',     108, 1, 'operlog',    'monitor/operlog/index',    '', '', 1, 0, 'C', '0', '0', 'monitor:operlog:list', 'form',      'admin', CURRENT_TIMESTAMP, '', NULL, 'Operation Log Menu'),
(501, 'Login Log',         108, 2, 'logininfor', 'monitor/logininfor/index', '', '', 1, 0, 'C', '0', '0', 'monitor:logininfor:list', 'logininfor', 'admin', CURRENT_TIMESTAMP, '', NULL, 'Login Log Menu');

-- User Management Button Permissions (Level 4)
INSERT INTO sys_menu VALUES
(1000, 'User Query',     100, 1, '', '', '', '', 1, 0, 'F', '0', '0', 'system:user:query',          '#', 'admin', CURRENT_TIMESTAMP, '', NULL, ''),
(1001, 'Add User',       100, 2, '', '', '', '', 1, 0, 'F', '0', '0', 'system:user:add',            '#', 'admin', CURRENT_TIMESTAMP, '', NULL, ''),
(1002, 'Edit User',      100, 3, '', '', '', '', 1, 0, 'F', '0', '0', 'system:user:edit',           '#', 'admin', CURRENT_TIMESTAMP, '', NULL, ''),
(1003, 'Delete User',    100, 4, '', '', '', '', 1, 0, 'F', '0', '0', 'system:user:remove',         '#', 'admin', CURRENT_TIMESTAMP, '', NULL, ''),
(1004, 'Export User',    100, 5, '', '', '', '', 1, 0, 'F', '0', '0', 'system:user:export',         '#', 'admin', CURRENT_TIMESTAMP, '', NULL, ''),
(1005, 'Import User',    100, 6, '', '', '', '', 1, 0, 'F', '0', '0', 'system:user:import',         '#', 'admin', CURRENT_TIMESTAMP, '', NULL, ''),
(1006, 'Reset Password', 100, 7, '', '', '', '', 1, 0, 'F', '0', '0', 'system:user:resetPwd',       '#', 'admin', CURRENT_TIMESTAMP, '', NULL, '');

-- Role Management Button Permissions (Level 4)
INSERT INTO sys_menu VALUES
(1100, 'Role Query',  101, 1, '', '', '', '', 1, 0, 'F', '0', '0', 'system:role:query',          '#', 'admin', CURRENT_TIMESTAMP, '', NULL, ''),
(1101, 'Add Role',    101, 2, '', '', '', '', 1, 0, 'F', '0', '0', 'system:role:add',            '#', 'admin', CURRENT_TIMESTAMP, '', NULL, ''),
(1102, 'Edit Role',   101, 3, '', '', '', '', 1, 0, 'F', '0', '0', 'system:role:edit',           '#', 'admin', CURRENT_TIMESTAMP, '', NULL, ''),
(1103, 'Delete Role', 101, 4, '', '', '', '', 1, 0, 'F', '0', '0', 'system:role:remove',         '#', 'admin', CURRENT_TIMESTAMP, '', NULL, ''),
(1104, 'Export Role', 101, 5, '', '', '', '', 1, 0, 'F', '0', '0', 'system:role:export',         '#', 'admin', CURRENT_TIMESTAMP, '', NULL, '');

-- Menu Management Buttons
INSERT INTO sys_menu VALUES
(1200, 'Menu Query',   102, 1, '', '', '', '', 1, 0, 'F', '0', '0', 'system:menu:query',   '#', 'admin', CURRENT_TIMESTAMP, '', NULL, ''),
(1201, 'Add Menu',     102, 2, '', '', '', '', 1, 0, 'F', '0', '0', 'system:menu:add',     '#', 'admin', CURRENT_TIMESTAMP, '', NULL, ''),
(1202, 'Edit Menu',    102, 3, '', '', '', '', 1, 0, 'F', '0', '0', 'system:menu:edit',    '#', 'admin', CURRENT_TIMESTAMP, '', NULL, ''),
(1203, 'Delete Menu',  102, 4, '', '', '', '', 1, 0, 'F', '0', '0', 'system:menu:remove',  '#', 'admin', CURRENT_TIMESTAMP, '', NULL, '');

-- Department Management Buttons
INSERT INTO sys_menu VALUES
(1300, 'Department Query',  103, 1, '', '', '', '', 1, 0, 'F', '0', '0', 'system:dept:query',   '#', 'admin', CURRENT_TIMESTAMP, '', NULL, ''),
(1301, 'Add Department',    103, 2, '', '', '', '', 1, 0, 'F', '0', '0', 'system:dept:add',     '#', 'admin', CURRENT_TIMESTAMP, '', NULL, ''),
(1302, 'Edit Department',   103, 3, '', '', '', '', 1, 0, 'F', '0', '0', 'system:dept:edit',    '#', 'admin', CURRENT_TIMESTAMP, '', NULL, ''),
(1303, 'Delete Department', 103, 4, '', '', '', '', 1, 0, 'F', '0', '0', 'system:dept:remove',  '#', 'admin', CURRENT_TIMESTAMP, '', NULL, '');

-- Post Management Buttons
INSERT INTO sys_menu VALUES
(1400, 'Post Query',   104, 1, '', '', '', '', 1, 0, 'F', '0', '0', 'system:post:query',   '#', 'admin', CURRENT_TIMESTAMP, '', NULL, ''),
(1401, 'Add Post',     104, 2, '', '', '', '', 1, 0, 'F', '0', '0', 'system:post:add',     '#', 'admin', CURRENT_TIMESTAMP, '', NULL, ''),
(1402, 'Edit Post',    104, 3, '', '', '', '', 1, 0, 'F', '0', '0', 'system:post:edit',    '#', 'admin', CURRENT_TIMESTAMP, '', NULL, ''),
(1403, 'Delete Post',  104, 4, '', '', '', '', 1, 0, 'F', '0', '0', 'system:post:remove',  '#', 'admin', CURRENT_TIMESTAMP, '', NULL, ''),
(1404, 'Export Post',  104, 5, '', '', '', '', 1, 0, 'F', '0', '0', 'system:post:export',  '#', 'admin', CURRENT_TIMESTAMP, '', NULL, '');

-- Dictionary Management Buttons
INSERT INTO sys_menu VALUES
(1500, 'Dictionary Query',   105, 1, '#', '', '', '', 1, 0, 'F', '0', '0', 'system:dict:query',   '#', 'admin', CURRENT_TIMESTAMP, '', NULL, ''),
(1501, 'Add Dictionary',     105, 2, '#', '', '', '', 1, 0, 'F', '0', '0', 'system:dict:add',     '#', 'admin', CURRENT_TIMESTAMP, '', NULL, ''),
(1502, 'Edit Dictionary',    105, 3, '#', '', '', '', 1, 0, 'F', '0', '0', 'system:dict:edit',    '#', 'admin', CURRENT_TIMESTAMP, '', NULL, ''),
(1503, 'Delete Dictionary',  105, 4, '#', '', '', '', 1, 0, 'F', '0', '0', 'system:dict:remove',  '#', 'admin', CURRENT_TIMESTAMP, '', NULL, ''),
(1504, 'Export Dictionary',  105, 5, '#', '', '', '', 1, 0, 'F', '0', '0', 'system:dict:export',  '#', 'admin', CURRENT_TIMESTAMP, '', NULL, '');

-- Parameter Settings Buttons
INSERT INTO sys_menu VALUES
(1600, 'Parameter Query',   106, 1, '#', '', '', '', 1, 0, 'F', '0', '0', 'system:config:query',    '#', 'admin', CURRENT_TIMESTAMP, '', NULL, ''),
(1601, 'Add Parameter',     106, 2, '#', '', '', '', 1, 0, 'F', '0', '0', 'system:config:add',      '#', 'admin', CURRENT_TIMESTAMP, '', NULL, ''),
(1602, 'Edit Parameter',    106, 3, '#', '', '', '', 1, 0, 'F', '0', '0', 'system:config:edit',     '#', 'admin', CURRENT_TIMESTAMP, '', NULL, ''),
(1603, 'Delete Parameter',  106, 4, '#', '', '', '', 1, 0, 'F', '0', '0', 'system:config:remove',   '#', 'admin', CURRENT_TIMESTAMP, '', NULL, ''),
(1604, 'Export Parameter',  106, 5, '#', '', '', '', 1, 0, 'F', '0', '0', 'system:config:export',   '#', 'admin', CURRENT_TIMESTAMP, '', NULL, '');

-- Notification Announcement Buttons
INSERT INTO sys_menu VALUES
(1700, 'Announcement Query',   107, 1, '#', '', '', '', 1, 0, 'F', '0', '0', 'system:notice:query',    '#', 'admin', CURRENT_TIMESTAMP, '', NULL, ''),
(1701, 'Add Announcement',     107, 2, '#', '', '', '', 1, 0, 'F', '0', '0', 'system:notice:add',      '#', 'admin', CURRENT_TIMESTAMP, '', NULL, ''),
(1702, 'Edit Announcement',    107, 3, '#', '', '', '', 1, 0, 'F', '0', '0', 'system:notice:edit',     '#', 'admin', CURRENT_TIMESTAMP, '', NULL, ''),
(1703, 'Delete Announcement',  107, 4, '#', '', '', '', 1, 0, 'F', '0', '0', 'system:notice:remove',   '#', 'admin', CURRENT_TIMESTAMP, '', NULL, '');

-- Operation Log Buttons
INSERT INTO sys_menu VALUES
(1800, 'Operation Query',      500, 1, '#', '', '', '', 1, 0, 'F', '0', '0', 'monitor:operlog:query',  '#', 'admin', CURRENT_TIMESTAMP, '', NULL, ''),
(1801, 'Delete Operation',     500, 2, '#', '', '', '', 1, 0, 'F', '0', '0', 'monitor:operlog:remove', '#', 'admin', CURRENT_TIMESTAMP, '', NULL, ''),
(1802, 'Export Log',           500, 3, '#', '', '', '', 1, 0, 'F', '0', '0', 'monitor:operlog:export', '#', 'admin', CURRENT_TIMESTAMP, '', NULL, '');

-- Login Log Buttons
INSERT INTO sys_menu VALUES
(1900, 'Login Query',          501, 1, '#', '', '', '', 1, 0, 'F', '0', '0', 'monitor:logininfor:query',   '#', 'admin', CURRENT_TIMESTAMP, '', NULL, ''),
(1901, 'Delete Login',         501, 2, '#', '', '', '', 1, 0, 'F', '0', '0', 'monitor:logininfor:remove',  '#', 'admin', CURRENT_TIMESTAMP, '', NULL, ''),
(1902, 'Export Log',           501, 3, '#', '', '', '', 1, 0, 'F', '0', '0', 'monitor:logininfor:export',  '#', 'admin', CURRENT_TIMESTAMP, '', NULL, ''),
(1903, 'Account Unlock',       501, 4, '#', '', '', '', 1, 0, 'F', '0', '0', 'monitor:logininfor:unlock',  '#', 'admin', CURRENT_TIMESTAMP, '', NULL, '');

-- Parameter Buttons
INSERT INTO sys_menu VALUES
(2300, 'Add Param',    112, 1, '#', '', '', '', 1, 0, 'F', '0', '0', 'system:param:add',    '#', 'admin', CURRENT_TIMESTAMP, '', NULL, ''),
(2301, 'Edit Param',   112, 2, '#', '', '', '', 1, 0, 'F', '0', '0', 'system:param:edit',   '#', 'admin', CURRENT_TIMESTAMP, '', NULL, ''),
(2302, 'Remove Param', 112, 3, '#', '', '', '', 1, 0, 'F', '0', '0', 'system:param:remove', '#', 'admin', CURRENT_TIMESTAMP, '', NULL, ''),
(2303, 'Export Param', 112, 3, '#', '', '', '', 1, 0, 'F', '0', '0', 'system:param:export', '#', 'admin', CURRENT_TIMESTAMP, '', NULL, '');

-- Query Users Buttons
INSERT INTO sys_menu VALUES
(2400, 'Edit Interface', 113, 1, '#', '', '', '', 1, 0, 'F', '0', '0', 'system:user:edit',   '#', 'admin', CURRENT_TIMESTAMP, '', NULL, '');

-- Online User Buttons
INSERT INTO sys_menu VALUES
(2500, 'Online Query',        120, 1, '#', '', '', '', 1, 0, 'F', '0', '0', 'monitor:online:query',       '#', 'admin', CURRENT_TIMESTAMP, '', NULL, ''),
(2501, 'Batch Force Logout',  120, 2, '#', '', '', '', 1, 0, 'F', '0', '0', 'monitor:online:batchLogout', '#', 'admin', CURRENT_TIMESTAMP, '', NULL, ''),
(2502, 'Single Force Logout', 120, 3, '#', '', '', '', 1, 0, 'F', '0', '0', 'monitor:online:forceLogout', '#', 'admin', CURRENT_TIMESTAMP, '', NULL, '');

-- Scheduled Task Buttons
INSERT INTO sys_menu VALUES
(2600, 'Task Query',    121, 1, '#', '', '', '', 1, 0, 'F', '0', '0', 'monitor:job:query',          '#', 'admin', CURRENT_TIMESTAMP, '', NULL, ''),
(2601, 'Add Task',      121, 2, '#', '', '', '', 1, 0, 'F', '0', '0', 'monitor:job:add',            '#', 'admin', CURRENT_TIMESTAMP, '', NULL, ''),
(2602, 'Edit Task',     121, 3, '#', '', '', '', 1, 0, 'F', '0', '0', 'monitor:job:edit',           '#', 'admin', CURRENT_TIMESTAMP, '', NULL, ''),
(2603, 'Delete Task',   121, 4, '#', '', '', '', 1, 0, 'F', '0', '0', 'monitor:job:remove',         '#', 'admin', CURRENT_TIMESTAMP, '', NULL, ''),
(2604, 'Change Status', 121, 5, '#', '', '', '', 1, 0, 'F', '0', '0', 'monitor:job:changeStatus',   '#', 'admin', CURRENT_TIMESTAMP, '', NULL, ''),
(2605, 'Export Task',   121, 6, '#', '', '', '', 1, 0, 'F', '0', '0', 'monitor:job:export',         '#', 'admin', CURRENT_TIMESTAMP, '', NULL, '');

SELECT setval(pg_get_serial_sequence('sys_menu', 'menu_id'), (SELECT MAX(menu_id) FROM sys_menu));

-- User and Role Association Table (Users N-1 Roles)
CREATE TABLE sys_user_role (
    user_id   BIGINT    NOT NULL,
    role_id   BIGINT    NOT NULL,
    PRIMARY KEY (user_id, role_id)
);

-- Initialization - User and Role Association Table Data
INSERT INTO sys_user_role VALUES (1, 1);
INSERT INTO sys_user_role VALUES (2, 2);

-- Role and Menu Association Table (Role 1-N Menu)
CREATE TABLE sys_role_menu (
    role_id   BIGINT    NOT NULL,
    menu_id   BIGINT    NOT NULL,
    PRIMARY KEY (role_id, menu_id)
);

-- Role and Department Association Table
CREATE TABLE sys_role_dept (
    role_id   BIGINT    NOT NULL,
    dept_id   BIGINT    NOT NULL,
    PRIMARY KEY (role_id, dept_id)
);

-- Initialization - Role and Department Association Table Data
INSERT INTO sys_role_dept VALUES
(2, 100),
(2, 101),
(2, 105);

-- User and Post Association Table
CREATE TABLE sys_user_post (
    user_id   BIGINT    NOT NULL,
    post_id   BIGINT    NOT NULL,
    PRIMARY KEY (user_id, post_id)
);

-- Initialization - User and Post Association Table Data
INSERT INTO sys_user_post VALUES
(1, 1),
(2, 2);

-- Operation Log Records Table
CREATE TABLE sys_oper_log (
    oper_id           SERIAL     NOT NULL PRIMARY KEY,
    title             VARCHAR(50)   DEFAULT '',
    business_type     SMALLINT      DEFAULT 0,
    method            VARCHAR(200)  DEFAULT '',
    request_method    VARCHAR(10)   DEFAULT '',
    operator_type     SMALLINT      DEFAULT 0,
    oper_name         VARCHAR(50)   DEFAULT '',
    dept_name         VARCHAR(50)   DEFAULT '',
    oper_url          VARCHAR(255)  DEFAULT '',
    oper_ip           VARCHAR(128)  DEFAULT '',
    oper_location     VARCHAR(255)  DEFAULT '',
    oper_param        VARCHAR(2000) DEFAULT '',
    json_result       VARCHAR(2000) DEFAULT '',
    status            SMALLINT      DEFAULT 0,
    error_msg         VARCHAR(2000) DEFAULT '',
    oper_time         TIMESTAMP                ,
    cost_time         BIGINT        DEFAULT 0  --,
--     CONSTRAINT idx_sys_oper_log_bt UNIQUE (business_type),
--     CONSTRAINT idx_sys_oper_log_s  UNIQUE (status),
--     CONSTRAINT idx_sys_oper_log_ot UNIQUE (oper_time)
);

SELECT setval(pg_get_serial_sequence('sys_oper_log', 'oper_id'), (SELECT MAX(oper_id) FROM sys_oper_log));

-- Dictionary Type Table
CREATE TABLE sys_dict_type (
    dict_id          SERIAL     NOT NULL PRIMARY KEY,
    dict_name        VARCHAR(100)  DEFAULT '',
    dict_type        VARCHAR(100)  DEFAULT '' UNIQUE,
    status           CHAR(1)       DEFAULT '0',
    create_by        VARCHAR(64)   DEFAULT '',
    create_time      TIMESTAMP               ,
    update_by        VARCHAR(64)   DEFAULT '',
    update_time      TIMESTAMP                  ,
    remark           VARCHAR(500)  DEFAULT NULL
);

-- Initialization - Dictionary Type Table Data
INSERT INTO sys_dict_type VALUES
(1,  'User Gender',    'sys_user_sex',           '0', 'admin', CURRENT_TIMESTAMP, '', NULL, 'User gender list'),
(2,  'Menu Status',    'sys_show_hide',          '0', 'admin', CURRENT_TIMESTAMP, '', NULL, 'Menu status list'),
(3,  'System Switch',  'sys_normal_disable',     '0', 'admin', CURRENT_TIMESTAMP, '', NULL, 'System switch list'),
(4,  'Task Status',    'sys_job_status',         '0', 'admin', CURRENT_TIMESTAMP, '', NULL, 'Task status list'),
(5,  'Task Group',     'sys_job_group',          '0', 'admin', CURRENT_TIMESTAMP, '', NULL, 'Task group list'),
(6,  'System Yes/No',  'sys_yes_no',             '0', 'admin', CURRENT_TIMESTAMP, '', NULL, 'System yes/no list'),
(7,  'Notice Type',    'sys_notice_type',        '0', 'admin', CURRENT_TIMESTAMP, '', NULL, 'Notice type list'),
(8,  'Notice Status',  'sys_notice_status',      '0', 'admin', CURRENT_TIMESTAMP, '', NULL, 'Notice status list'),
(9,  'Operation Type', 'sys_oper_type',          '0', 'admin', CURRENT_TIMESTAMP, '', NULL, 'Operation type list'),
(10, 'System Status',  'sys_common_status',      '0', 'admin', CURRENT_TIMESTAMP, '', NULL, 'Login status list'),
(11, 'Field Type',     'field_type',             '0', 'admin', CURRENT_TIMESTAMP, '', NULL, 'Geo-fence field type list');

SELECT setval(pg_get_serial_sequence('sys_dict_type', 'dict_id'), (SELECT MAX(dict_id) FROM sys_dict_type));

-- Dictionary Data Table
CREATE TABLE sys_dict_data (
    dict_code        SERIAL     NOT NULL PRIMARY KEY ,
    dict_sort        INT           DEFAULT 0 ,
    dict_label       VARCHAR(100)  DEFAULT '' ,
    dict_value       VARCHAR(100)  DEFAULT '' ,
    dict_type        VARCHAR(100)  DEFAULT '' ,
    css_class        VARCHAR(100)  DEFAULT NULL ,
    list_class       VARCHAR(100)  DEFAULT NULL ,
    is_default       CHAR(1)       DEFAULT 'N' ,
    status           CHAR(1)       DEFAULT '0' ,
    create_by        VARCHAR(64)   DEFAULT '' ,
    create_time      TIMESTAMP                  ,
    update_by        VARCHAR(64)   DEFAULT '' ,
    update_time      TIMESTAMP                 ,
    remark           VARCHAR(500)  DEFAULT NULL
);

-- Initialization - Dictionary Data Table
INSERT INTO sys_dict_data VALUES
(1,  1,  'Male',        '0',       'sys_user_sex',        '',   '',        'Y', '0', 'admin', CURRENT_TIMESTAMP, '', NULL, 'Gender male'),
(2,  2,  'Female',      '1',       'sys_user_sex',        '',   '',        'N', '0', 'admin', CURRENT_TIMESTAMP, '', NULL, 'Gender female'),
(3,  3,  'Unknown',     '2',       'sys_user_sex',        '',   '',        'N', '0', 'admin', CURRENT_TIMESTAMP, '', NULL, 'Gender unknown'),
(4,  1,  'Show',        '0',       'sys_show_hide',       '',   'primary', 'Y', '0', 'admin', CURRENT_TIMESTAMP, '', NULL, 'Show menu'),
(5,  2,  'Hide',        '1',       'sys_show_hide',       '',   'danger',  'N', '0', 'admin', CURRENT_TIMESTAMP, '', NULL, 'Hide menu'),
(6,  1,  'Normal',      '0',       'sys_normal_disable',  '',   'primary', 'Y', '0', 'admin', CURRENT_TIMESTAMP, '', NULL, 'Normal status'),
(7,  2,  'Disabled',    '1',       'sys_normal_disable',  '',   'danger',  'N', '0', 'admin', CURRENT_TIMESTAMP, '', NULL, 'Disabled status'),
(8,  1,  'Normal',      '0',       'sys_job_status',      '',   'primary', 'Y', '0', 'admin', CURRENT_TIMESTAMP, '', NULL, 'Normal status'),
(9,  2,  'Paused',      '1',       'sys_job_status',      '',   'danger',  'N', '0', 'admin', CURRENT_TIMESTAMP, '', NULL, 'Disabled status'),
(10, 1,  'Default',     'DEFAULT', 'sys_job_group',       '',   '',        'Y', '0', 'admin', CURRENT_TIMESTAMP, '', NULL, 'Default group'),
(11, 2,  'System',      'SYSTEM',  'sys_job_group',       '',   '',        'N', '0', 'admin', CURRENT_TIMESTAMP, '', NULL, 'System group'),
(12, 1,  'Yes',         'Y',       'sys_yes_no',          '',   'primary', 'Y', '0', 'admin', CURRENT_TIMESTAMP, '', NULL, 'System default yes'),
(13, 2,  'No',          'N',       'sys_yes_no',          '',   'danger',  'N', '0', 'admin', CURRENT_TIMESTAMP, '', NULL, 'System default no'),
(14, 1,  'Notice',      '1',       'sys_notice_type',     '',   'warning', 'Y', '0', 'admin', CURRENT_TIMESTAMP, '', NULL, 'Notice'),
(15, 2,  'Announcement','2',       'sys_notice_type',     '',   'success', 'N', '0', 'admin', CURRENT_TIMESTAMP, '', NULL, 'Announcement'),
(16, 1,  'Normal',      '0',       'sys_notice_status',   '',   'primary', 'Y', '0', 'admin', CURRENT_TIMESTAMP, '', NULL, 'Normal status'),
(17, 2,  'Closed',      '1',       'sys_notice_status',   '',   'danger',  'N', '0', 'admin', CURRENT_TIMESTAMP, '', NULL, 'Closed status'),
(18, 99, 'Other',       '0',       'sys_oper_type',       '',   'info',    'N', '0', 'admin', CURRENT_TIMESTAMP, '', NULL, 'Other operations'),
(19, 1,  'Add',         '1',       'sys_oper_type',       '',   'info',    'N', '0', 'admin', CURRENT_TIMESTAMP, '', NULL, 'Add operation'),
(20, 2,  'Modify',      '2',       'sys_oper_type',       '',   'info',    'N', '0', 'admin', CURRENT_TIMESTAMP, '', NULL, 'Modify operation'),
(21, 3,  'Delete',      '3',       'sys_oper_type',       '',   'danger',  'N', '0', 'admin', CURRENT_TIMESTAMP, '', NULL, 'Delete operation'),
(22, 4,  'Authorize',   '4',       'sys_oper_type',       '',   'primary', 'N', '0', 'admin', CURRENT_TIMESTAMP, '', NULL, 'Authorize operation'),
(23, 5,  'Export',      '5',       'sys_oper_type',       '',   'warning', 'N', '0', 'admin', CURRENT_TIMESTAMP, '', NULL, 'Export operation'),
(24, 6,  'Import',      '6',       'sys_oper_type',       '',   'warning', 'N', '0', 'admin', CURRENT_TIMESTAMP, '', NULL, 'Import operation'),
(25, 7,  'Force Logout','7',       'sys_oper_type',       '',   'danger',  'N', '0', 'admin', CURRENT_TIMESTAMP, '', NULL, 'Force logout operation');

SELECT setval(pg_get_serial_sequence('sys_dict_data', 'dict_code'), (SELECT MAX(dict_code) FROM sys_dict_data));

-- Parameter Configuration Table
CREATE TABLE sys_config (
    config_id         SERIAL         NOT NULL PRIMARY KEY,
    config_name       VARCHAR(100)   DEFAULT '' ,
    config_key        VARCHAR(100)   DEFAULT '' ,
    config_value      VARCHAR(500)   DEFAULT '' ,
    config_type       CHAR(1)        DEFAULT 'N' ,
    create_by         VARCHAR(64)    DEFAULT '' ,
    create_time       TIMESTAMP                 ,
    update_by         VARCHAR(64)    DEFAULT '' ,
    update_time       TIMESTAMP                  ,
    remark            VARCHAR(500)   DEFAULT NULL
);

-- Initialization - Parameter Configuration Table Data
INSERT INTO sys_config VALUES
(1, 'Main Framework Page - Default Skin Style Name',  'sys.index.skinName',         'skin-blue', 'Y', 'admin', CURRENT_TIMESTAMP, '', NULL, 'Blue skin-blue, Green skin-green, Purple skin-purple, Red skin-red, Yellow skin-yellow'),
(2, 'User Management - Initial Password',            'sys.user.initPassword',      '123456',    'Y', 'admin', CURRENT_TIMESTAMP, '', NULL, 'Initial password 123456'),
(3, 'Main Framework Page - Sidebar Theme',           'sys.index.sideTheme',        'theme-dark','Y', 'admin', CURRENT_TIMESTAMP, '', NULL, 'Dark theme theme-dark, Light theme theme-light'),
(4, 'Account Self-Service - CAPTCHA Switch',         'sys.account.captchaEnabled', 'true',      'Y', 'admin', CURRENT_TIMESTAMP, '', NULL, 'Whether to enable CAPTCHA function (true to enable, false to disable)'),
(5, 'Account Self-Service - User Registration',      'sys.account.registerUser',   'false',     'Y', 'admin', CURRENT_TIMESTAMP, '', NULL, 'Whether to enable user registration (true to enable, false to disable)'),
(6, 'User Login - Blacklist',                        'sys.login.blackIPList',      '',          'Y', 'admin', CURRENT_TIMESTAMP, '', NULL, 'Set login IP blacklist restriction; multiple entries are separated by ;, supports matching (* wildcard, subnet)');

SELECT setval(pg_get_serial_sequence('sys_config', 'config_id'), (SELECT MAX(config_id) FROM sys_config));

-- System Access Records Table
CREATE TABLE sys_logininfor (
    info_id          SERIAL      NOT NULL PRIMARY KEY ,
    user_name        VARCHAR(50)    DEFAULT '' ,
    ipaddr           VARCHAR(128)   DEFAULT '' ,
    login_location   VARCHAR(255)   DEFAULT '' ,
    browser          VARCHAR(50)    DEFAULT '' ,
    os               VARCHAR(50)    DEFAULT '' ,
    status           CHAR(1)        DEFAULT '0' ,
    msg              VARCHAR(255)   DEFAULT '' ,
    login_time       TIMESTAMP

);

CREATE INDEX idx_sys_logininfor_s ON sys_logininfor (status);
CREATE INDEX idx_sys_logininfor_lt ON sys_logininfor (login_time);

SELECT setval(pg_get_serial_sequence('sys_logininfor', 'info_id'), (SELECT MAX(info_id) FROM sys_logininfor));

-- Scheduled Task Scheduling Table
CREATE TABLE sys_job (
    job_id              SERIAL     NOT NULL,
    job_name            VARCHAR(64)   DEFAULT '' ,
    job_group           VARCHAR(64)   DEFAULT 'DEFAULT',
    invoke_target       VARCHAR(500)  NOT NULL ,
    cron_expression     VARCHAR(255)  DEFAULT '' ,
    misfire_policy      VARCHAR(20)   DEFAULT '3' ,
    concurrent          CHAR(1)       DEFAULT '1',
    status              CHAR(1)       DEFAULT '0' ,
    create_by           VARCHAR(64)   DEFAULT '',
    create_time         TIMESTAMP                  ,
    update_by           VARCHAR(64)   DEFAULT '' ,
    update_time         TIMESTAMP                ,
    remark              VARCHAR(500)  DEFAULT '',
    PRIMARY KEY (job_id, job_name, job_group)
);

-- Initialization - Scheduled Task Scheduling Table Data
INSERT INTO sys_job VALUES
(1, 'System Default (No Parameters)', 'DEFAULT', 'ryTask.ryNoParams',       '0/10 * * * * ?', '3', '1', '1', 'admin', CURRENT_TIMESTAMP, '', NULL, ''),
(2, 'System Default (With Parameters)', 'DEFAULT', 'ryTask.ryParams1',  '0/15 * * * * ?', '3', '1', '1', 'admin', CURRENT_TIMESTAMP, '', NULL, ''),
(3, 'System Default (Multiple Parameters)', 'DEFAULT', 'ryTask.ryMultipleParams2', '0/20 * * * * ?', '3', '1', '1', 'admin', CURRENT_TIMESTAMP, '', NULL, '');

SELECT setval(pg_get_serial_sequence('sys_job', 'job_id'), (SELECT MAX(job_id) FROM sys_job));

-- Scheduled Task Scheduling Log Table
CREATE TABLE sys_job_log (
    job_log_id       SERIAL      NOT NULL PRIMARY KEY,
    job_name         VARCHAR(64)    NOT NULL ,
    job_group        VARCHAR(64)    NOT NULL ,
    invoke_target    VARCHAR(500)   NOT NULL ,
    job_message      VARCHAR(500)               ,
    status           CHAR(1)        DEFAULT '0' ,
    exception_info   VARCHAR(2000)  DEFAULT ''  ,
    create_time      TIMESTAMP
);

SELECT setval(pg_get_serial_sequence('sys_job_log', 'job_log_id'), (SELECT MAX(job_log_id) FROM sys_job_log));

-- Notification Announcement Table
CREATE TABLE sys_notice (
    notice_id        SERIAL         NOT NULL PRIMARY KEY,
    notice_title     VARCHAR(100)   NOT NULL ,
    notice_type      CHAR(1)        NOT NULL ,
    notice_content   BYTEA          DEFAULT NULL ,
    status           CHAR(1)        DEFAULT '0' ,
    create_by        VARCHAR(64)    DEFAULT ''  ,
    create_time      TIMESTAMP                  ,
    update_by        VARCHAR(64)    DEFAULT ''  ,
    update_time      TIMESTAMP                 ,
    remark           VARCHAR(255)   DEFAULT NULL
);

-- Initialization - Notification Announcement Table Data
INSERT INTO sys_notice VALUES
(1, 'Warm Reminder: On 2018-07-01, a new version of RuoYi has been released', '2', 'New version content', '0', 'admin', CURRENT_TIMESTAMP, '', NULL, 'Admin'),
(2, 'Maintenance Notice: On 2018-07-01, RuoYi system maintenance at midnight', '1', 'Maintenance content',   '0', 'admin', CURRENT_TIMESTAMP, '', NULL, 'Admin');

SELECT setval(pg_get_serial_sequence('sys_notice', 'notice_id'), (SELECT MAX(notice_id) FROM sys_notice));


COMMIT;