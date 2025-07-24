package com.serat.system.common.utils.handler;

import org.apache.ibatis.type.BaseTypeHandler;
import org.apache.ibatis.type.JdbcType;

import java.sql.*;

public class BooleanToSmallIntTypeHandler extends BaseTypeHandler<Boolean> {

    @Override
    public void setNonNullParameter(PreparedStatement ps, int i, Boolean parameter, JdbcType jdbcType) throws SQLException {
        ps.setShort(i, parameter ? (short) 1 : (short) 0);
    }

    @Override
    public Boolean getNullableResult(ResultSet rs, String columnName) throws SQLException {
        short value = rs.getShort(columnName);
        return rs.wasNull() ? null : value == 1;
    }

    @Override
    public Boolean getNullableResult(ResultSet rs, int columnIndex) throws SQLException {
        short value = rs.getShort(columnIndex);
        return rs.wasNull() ? null : value == 1;
    }

    @Override
    public Boolean getNullableResult(CallableStatement cs, int columnIndex) throws SQLException {
        short value = cs.getShort(columnIndex);
        return cs.wasNull() ? null : value == 1;
    }
}
