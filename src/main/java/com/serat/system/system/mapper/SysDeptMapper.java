package com.serat.system.system.mapper;

import com.serat.system.common.core.domain.entity.SysDept;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface SysDeptMapper
{
    List<SysDept> selectDeptList(SysDept dept);

    List<Long> selectDeptListByRoleId(@Param("roleId") Long roleId, @Param("deptCheckStrictly") boolean deptCheckStrictly);

    SysDept selectDeptById(Long deptId);

    List<SysDept> selectChildrenDeptById(Long deptId);

    int selectNormalChildrenDeptById(Long deptId);

    int hasChildByDeptId(Long deptId);

    int checkDeptExistUser(Long deptId);

    SysDept checkDeptNameUnique(@Param("deptName") String deptName, @Param("parentId") Long parentId);

    int insertDept(SysDept dept);

    int updateDept(SysDept dept);

    void updateDeptStatusNormal(Long[] deptIds);

    int updateDeptChildren(@Param("depts") List<SysDept> depts);

    int deleteDeptById(Long deptId);
}
