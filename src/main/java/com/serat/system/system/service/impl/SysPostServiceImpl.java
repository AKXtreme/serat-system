package com.serat.system.system.service.impl;

import com.serat.system.common.constant.UserConstants;
import com.serat.system.common.exception.ServiceException;
import com.serat.system.common.utils.StringUtils;
import com.serat.system.system.domain.SysPost;
import com.serat.system.system.mapper.SysPostMapper;
import com.serat.system.system.mapper.SysUserPostMapper;
import com.serat.system.system.service.ISysPostService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SysPostServiceImpl implements ISysPostService
{
    @Autowired
    private SysPostMapper postMapper;

    @Autowired
    private SysUserPostMapper userPostMapper;

    @Override
    public List<SysPost> selectPostList(SysPost post)
    {
        return postMapper.selectPostList(post);
    }

    @Override
    public List<SysPost> selectPostAll()
    {
        return postMapper.selectPostAll();
    }

    @Override
    public SysPost selectPostById(Long postId)
    {
        return postMapper.selectPostById(postId);
    }

    @Override
    public List<Long> selectPostListByUserId(Long userId)
    {
        return postMapper.selectPostListByUserId(userId);
    }

    @Override
    public boolean checkPostNameUnique(SysPost post)
    {
        Long postId = StringUtils.isNull(post.getPostId()) ? -1L : post.getPostId();
        SysPost info = postMapper.checkPostNameUnique(post.getPostName());
        if (StringUtils.isNotNull(info) && info.getPostId().longValue() != postId.longValue())
        {
            return UserConstants.NOT_UNIQUE;
        }
        return UserConstants.UNIQUE;
    }

    @Override
    public boolean checkPostCodeUnique(SysPost post)
    {
        Long postId = StringUtils.isNull(post.getPostId()) ? -1L : post.getPostId();
        SysPost info = postMapper.checkPostCodeUnique(post.getPostCode());
        if (StringUtils.isNotNull(info) && info.getPostId().longValue() != postId.longValue())
        {
            return UserConstants.NOT_UNIQUE;
        }
        return UserConstants.UNIQUE;
    }

    @Override
    public int countUserPostById(Long postId)
    {
        return userPostMapper.countUserPostById(postId);
    }

    @Override
    public int deletePostById(Long postId)
    {
        return postMapper.deletePostById(postId);
    }

    @Override
    public int deletePostByIds(Long[] postIds)
    {
        for (Long postId : postIds)
        {
            SysPost post = selectPostById(postId);
            if (countUserPostById(postId) > 0)
            {
                throw new ServiceException(String.format("%1$s is already assigned and cannot be deleted", post.getPostName()));            }
        }
        return postMapper.deletePostByIds(postIds);
    }

    @Override
    public int insertPost(SysPost post)
    {
        return postMapper.insertPost(post);
    }

    @Override
    public int updatePost(SysPost post)
    {
        return postMapper.updatePost(post);
    }
}
