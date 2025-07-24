package com.serat.system.system.service;

import com.serat.system.system.domain.SysPost;

import java.util.List;

public interface ISysPostService
{
    List<SysPost> selectPostList(SysPost post);
    List<SysPost> selectPostAll();
    SysPost selectPostById(Long postId);
    List<Long> selectPostListByUserId(Long userId);
    boolean checkPostNameUnique(SysPost post);
    boolean checkPostCodeUnique(SysPost post);
    int countUserPostById(Long postId);
    int deletePostById(Long postId);
    int deletePostByIds(Long[] postIds);
    int insertPost(SysPost post);
    int updatePost(SysPost post);
}
