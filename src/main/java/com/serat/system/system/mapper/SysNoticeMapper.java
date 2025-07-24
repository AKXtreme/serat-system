package com.serat.system.system.mapper;

import com.serat.system.system.domain.SysNotice;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface SysNoticeMapper
{
    SysNotice selectNoticeById(Long noticeId);

    List<SysNotice> selectNoticeList(SysNotice notice);

    int insertNotice(SysNotice notice);

    int updateNotice(SysNotice notice);

    int deleteNoticeById(Long noticeId);

    int deleteNoticeByIds(Long[] noticeIds);
}
