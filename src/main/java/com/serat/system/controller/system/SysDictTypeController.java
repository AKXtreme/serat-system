package com.serat.system.controller.system;

import com.serat.system.common.annotation.Log;
import com.serat.system.common.core.controller.BaseController;
import com.serat.system.common.core.domain.AjaxResult;
import com.serat.system.common.core.domain.entity.SysDictType;
import com.serat.system.common.core.page.TableDataInfo;
import com.serat.system.common.enums.RequestType;
import com.serat.system.common.utils.poi.ExcelUtil;
import com.serat.system.system.service.ISysDictTypeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpServletResponse;
import java.util.List;

@RestController
@RequestMapping("/system/dict/type")
public class SysDictTypeController extends BaseController
{
    @Autowired
    private ISysDictTypeService dictTypeService;

    @PreAuthorize("@ss.hasPermi('system:dict:list')")
    @GetMapping("/list")
    public TableDataInfo list(SysDictType dictType)
    {
        startPage();
        List<SysDictType> list = dictTypeService.selectDictTypeList(dictType);
        return getDataTable(list);
    }

    @Log(title = "Dictionary type", businessType = RequestType.EXPORT)
    @PreAuthorize("@ss.hasPermi('system:dict:export')")
    @PostMapping("/export")
    public void export(HttpServletResponse response, SysDictType dictType)
    {
        List<SysDictType> list = dictTypeService.selectDictTypeList(dictType);
        ExcelUtil<SysDictType> util = new ExcelUtil<SysDictType>(SysDictType.class);
        util.exportExcel(response, list, "Dictionary type");
    }

    @PreAuthorize("@ss.hasPermi('system:dict:query')")
    @GetMapping(value = "/{dictId}")
    public AjaxResult getInfo(@PathVariable Long dictId)
    {
        return success(dictTypeService.selectDictTypeById(dictId));
    }

    @PreAuthorize("@ss.hasPermi('system:dict:add')")
    @Log(title = "Dictionary type", businessType = RequestType.INSERT)
    @PostMapping
    public AjaxResult add(@Validated @RequestBody SysDictType dict)
    {
        if (!dictTypeService.checkDictTypeUnique(dict))
        {
            return error("Dictionary type'" + dict.getDictName() + "'Failed, dictionary type already exists");
        }
        dict.setCreateBy(getUsername());
        return toAjax(dictTypeService.insertDictType(dict));
    }

    @PreAuthorize("@ss.hasPermi('system:dict:edit')")
    @Log(title = "Dictionary type", businessType = RequestType.UPDATE)
    @PutMapping
    public AjaxResult edit(@Validated @RequestBody SysDictType dict)
    {
        if (!dictTypeService.checkDictTypeUnique(dict))
        {
            return error("Modify dictionary'" + dict.getDictName() + "'Failed, dictionary type already exists");
        }
        dict.setUpdateBy(getUsername());
        return toAjax(dictTypeService.updateDictType(dict));
    }

    @PreAuthorize("@ss.hasPermi('system:dict:remove')")
    @Log(title = "Dictionary type", businessType = RequestType.DELETE)
    @DeleteMapping("/{dictIds}")
    public AjaxResult remove(@PathVariable Long[] dictIds)
    {
        dictTypeService.deleteDictTypeByIds(dictIds);
        return success();
    }

    @PreAuthorize("@ss.hasPermi('system:dict:remove')")
    @Log(title = "Dictionary type", businessType = RequestType.CLEAN)
    @DeleteMapping("/refreshCache")
    public AjaxResult refreshCache()
    {
        dictTypeService.resetDictCache();
        return success();
    }

    @GetMapping("/optionselect")
    public AjaxResult optionselect()
    {
        List<SysDictType> dictTypes = dictTypeService.selectDictTypeAll();
        return success(dictTypes);
    }
}
