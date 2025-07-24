package com.serat.system.system.service.impl;

import com.serat.system.system.domain.SysNotice;
import com.serat.system.system.mapper.SysNoticeMapper;
import com.serat.system.system.service.ISysNoticeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SysNoticeServiceImpl implements ISysNoticeService
{
    @Autowired
    private SysNoticeMapper noticeMapper;

    @Override
    public SysNotice selectNoticeById(Long noticeId)
    {
        return noticeMapper.selectNoticeById(noticeId);
    }

    @Override
    public List<SysNotice> selectNoticeList(SysNotice notice)
    {
        return noticeMapper.selectNoticeList(notice);
    }

    @Override
    public int insertNotice(SysNotice notice)
    {
        return noticeMapper.insertNotice(notice);
    }

    @Override
    public int updateNotice(SysNotice notice)
    {
        return noticeMapper.updateNotice(notice);
    }

    @Override
    public int deleteNoticeById(Long noticeId)
    {
        return noticeMapper.deleteNoticeById(noticeId);
    }

    @Override
    public int deleteNoticeByIds(Long[] noticeIds)
    {
        return noticeMapper.deleteNoticeByIds(noticeIds);
    }
}
