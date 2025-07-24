package com.serat.system.system.mapper;

import com.serat.system.system.domain.SysPost;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface SysPostMapper
{
    List<SysPost> selectPostList(SysPost post);

    List<SysPost> selectPostAll();

    SysPost selectPostById(Long postId);

    List<Long> selectPostListByUserId(Long userId);

    List<SysPost> selectPostsByUserName(String userName);

    int deletePostById(Long postId);

    int deletePostByIds(Long[] postIds);

    int updatePost(SysPost post);

    int insertPost(SysPost post);

    SysPost checkPostNameUnique(String postName);

    SysPost checkPostCodeUnique(String postCode);
}
