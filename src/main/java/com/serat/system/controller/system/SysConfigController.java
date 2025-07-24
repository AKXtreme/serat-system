package com.serat.system.controller.system;

import com.serat.system.common.annotation.Log;
import com.serat.system.common.core.controller.BaseController;
import com.serat.system.common.core.domain.AjaxResult;
import com.serat.system.common.core.page.TableDataInfo;
import com.serat.system.common.enums.RequestType;
import com.serat.system.common.utils.poi.ExcelUtil;
import com.serat.system.system.domain.SysConfig;
import com.serat.system.system.service.ISysConfigService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpServletResponse;
import java.util.List;

@RestController
@RequestMapping("/system/config")
public class SysConfigController extends BaseController
{
    @Autowired
    private ISysConfigService configService;

    /**
     * Get parameter configuration list
     */
    @PreAuthorize("@ss.hasPermi('system:config:list')")
    @GetMapping("/list")
    public TableDataInfo list(SysConfig config)
    {
        startPage();
        List<SysConfig> list = configService.selectConfigList(config);
        return getDataTable(list);
    }

    @Log(title = "Parameter management", businessType = RequestType.EXPORT)
    @PreAuthorize("@ss.hasPermi('system:config:export')")
    @PostMapping("/export")
    public void export(HttpServletResponse response, SysConfig config)
    {
        List<SysConfig> list = configService.selectConfigList(config);
        ExcelUtil<SysConfig> util = new ExcelUtil<SysConfig>(SysConfig.class);
        util.exportExcel(response, list, "Parameter data");
    }

    /**
     * Get detailed information based on parameter number
     */
    @PreAuthorize("@ss.hasPermi('system:config:query')")
    @GetMapping(value = "/{configId}")
    public AjaxResult getInfo(@PathVariable Long configId)
    {
        return success(configService.selectConfigById(configId));
    }

    /**
     * Query parameter value based on parameter key name
     */
    @GetMapping(value = "/configKey/{configKey}")
    public AjaxResult getConfigKey(@PathVariable String configKey)
    {
        return success(configService.selectConfigByKey(configKey));
    }

    /**
     * New parameter configuration
     */
    @PreAuthorize("@ss.hasPermi('system:config:add')")
    @Log(title = "Parameter management", businessType = RequestType.INSERT)
    @PostMapping
    public AjaxResult add(@Validated @RequestBody SysConfig config)
    {
        if (!configService.checkConfigKeyUnique(config))
        {
            return error("New parameters'" + config.getConfigName() + "'Failed, parameter key name already exists");
        }
        config.setCreateBy(getUsername());
        return toAjax(configService.insertConfig(config));
    }

    /**
     * Modify parameter configuration
     */
    @PreAuthorize("@ss.hasPermi('system:config:edit')")
    @Log(title = "Parameter management", businessType = RequestType.UPDATE)
    @PutMapping
    public AjaxResult edit(@Validated @RequestBody SysConfig config)
    {
        if (!configService.checkConfigKeyUnique(config))
        {
            return error("Modify parameters'" + config.getConfigName() + "'Failed, parameter key name already exists");
        }
        config.setUpdateBy(getUsername());
        return toAjax(configService.updateConfig(config));
    }

    /**
     * Delete parameter configuration
     */
    @PreAuthorize("@ss.hasPermi('system:config:remove')")
    @Log(title = "Parameter management", businessType = RequestType.DELETE)
    @DeleteMapping("/{configIds}")
    public AjaxResult remove(@PathVariable Long[] configIds)
    {
        configService.deleteConfigByIds(configIds);
        return success();
    }

    /**
     * Refresh parameter cache
     */
    @PreAuthorize("@ss.hasPermi('system:config:remove')")
    @Log(title = "Parameter management", businessType = RequestType.CLEAN)
    @DeleteMapping("/refreshCache")
    public AjaxResult refreshCache()
    {
        configService.resetConfigCache();
        return success();
    }
}
