/**
 * @file 一些处理方法
 */
import React from 'react';
import {
  BaseEventContext,
  defaultValue,
  EditorManager,
  getSchemaTpl,
  PluginActions,
  RendererPluginAction,
  RendererPluginEvent,
  SubRendererPluginAction
} from 'amis-editor-core';
import {ActionConfig, ComponentInfo, ContextVariables} from './types';
import {DataSchema, findTree} from 'amis-core';
import CmptActionSelect from './comp-action-select';
import {Button} from 'amis';

// 数据容器范围
export const DATA_CONTAINER = [
  'form',
  'dialog',
  'drawer',
  'wizard',
  'service',
  'page',
  'app',
  'chart'
];

// 是否数据容器
export const IS_DATA_CONTAINER = `${JSON.stringify(
  DATA_CONTAINER
)}.includes(__rendererName)`;

// 表单项组件
export const FORMITEM_CMPTS = [
  'button-group-select',
  'button-toolbar',
  'chained-select',
  'chart-radios',
  'checkbox',
  'checkboxes',
  'combo',
  'input-kv',
  'condition-builder',
  'diff-editor',
  'editor',
  'formula',
  'hidden',
  'icon-picker',
  'input-array',
  'input-city',
  'input-color',
  'input-date',
  'input-date-range',
  'input-datetime-range',
  'input-time-range',
  'input-excel',
  'input-file',
  'input-formula',
  'input-group',
  'input-image',
  'input-month-range',
  'input-number',
  'input-quarter-range',
  'input-range',
  'input-rating',
  'input-repeat',
  'input-rich-text',
  'input-sub-form',
  'input-table',
  'input-tag',
  'input-text',
  'input-password',
  'input-email',
  'input-url',
  'native-date',
  'native-time',
  'native-number',
  'input-tree',
  'input-year-range',
  'list-select',
  'location-picker',
  'matrix-checkboxes',
  'nested-select',
  'cascader-select',
  'picker',
  'radios',
  'select',
  'multi-select',
  'switch',
  'tabs-transfer',
  'tabs-transfer-picker',
  'textarea',
  'transfer',
  'transfer-picker',
  'tree-select',
  'uuid'
];

export const getArgsWrapper = (items: any, multiple: boolean = false) => ({
  type: 'combo',
  name: 'args',
  // label: '动作参数',
  multiple,
  strictMode: false,
  items: Array.isArray(items) ? items : [items]
});

// 动作配置项schema map
export const COMMON_ACTION_SCHEMA_MAP: {
  [propName: string]: RendererPluginAction;
} = {
  setValue: {
    innerArgs: ['value', 'valueInput'],
    descDetail: (info: any) => {
      return (
        <div>
          设置
          <span className="variable-left variable-right">
            {info?.__rendererLabel}
          </span>
          的值为
          <span className="variable-left variable-right">
            {info?.args?.value
              ? JSON.stringify(info?.args?.value)
              : info?.args?.valueInput}
          </span>
        </div>
      );
    },
    schema: getArgsWrapper({
      type: 'wrapper',
      className: 'p-none',
      body: [
        {
          type: 'combo',
          name: 'value',
          label: '变量赋值',
          multiple: true,
          removable: true,
          required: true,
          addable: true,
          strictMode: false,
          canAccessSuperData: true,
          mode: 'horizontal',
          items: [
            {
              name: 'key',
              type: 'input-text',
              placeholder: '变量名',
              required: true
            },
            {
              name: 'val',
              type: 'input-formula',
              placeholder: '变量值',
              variables: '${variables}',
              evalMode: false,
              variableMode: 'tabs',
              inputMode: 'input-group'
            }
          ],
          visibleOn: `data.__rendererName && ${IS_DATA_CONTAINER}`
        },
        {
          type: 'combo',
          name: 'value',
          label: '变量赋值',
          multiple: true,
          removable: true,
          required: true,
          addable: true,
          strictMode: false,
          canAccessSuperData: true,
          mode: 'horizontal',
          items: [
            {
              type: 'combo',
              name: 'item',
              label: false,
              renderLabel: false,
              multiple: true,
              removable: true,
              required: true,
              addable: true,
              strictMode: false,
              canAccessSuperData: true,
              className: 'm-l',
              mode: 'horizontal',
              items: [
                {
                  name: 'key',
                  type: 'input-text',
                  required: true
                },
                {
                  name: 'val',
                  type: 'input-formula',
                  variables: '${variables}',
                  evalMode: false,
                  variableMode: 'tabs',
                  inputMode: 'input-group'
                }
              ]
            }
          ],
          visibleOn: `data.__rendererName && __rendererName === 'combo'`
        },
        {
          name: 'valueInput',
          type: 'input-formula',
          variables: '${variables}',
          evalMode: false,
          variableMode: 'tabs',
          inputMode: 'input-group',
          label: '变量赋值',
          size: 'lg',
          mode: 'horizontal',
          visibleOn: `data.__rendererName && !${IS_DATA_CONTAINER} && __rendererName !== 'combo'`,
          required: true
        }
      ]
    })
  },
  reload: {
    descDetail: (info: any) => {
      return (
        <div>
          刷新
          <span className="variable-left variable-right">
            {info?.__rendererLabel}
          </span>
          组件
        </div>
      );
    }
  },
  clear: {
    descDetail: (info: any) => {
      return (
        <div>
          <span className="variable-right">{info?.__rendererLabel}</span>
          清空
        </div>
      );
    }
  },
  reset: {
    descDetail: (info: any) => {
      return (
        <div>
          <span className="variable-right">{info?.__rendererLabel}</span>
          重置
        </div>
      );
    }
  },
  submit: {
    descDetail: (info: any) => {
      return (
        <div>
          <span className="variable-right">{info?.__rendererLabel}</span>
          {info?.__rendererName === 'form' ? '提交' : null}
          {info?.__rendererName === 'wizard' ? '提交全部数据' : null}
        </div>
      );
    }
  },
  validate: {
    descDetail: (info: any) => {
      return (
        <div>
          <span className="variable-right">{info?.__rendererLabel}</span>
          校验
        </div>
      );
    }
  },
  prev: {
    descDetail: (info: any) => {
      return (
        <div>
          <span className="variable-right">{info?.__rendererLabel}</span>
          {info?.__rendererName === 'carousel' ? '滚动至上一张' : null}
          {info?.__rendererName === 'wizard' ? '返回前一步' : null}
        </div>
      );
    }
  },
  next: {
    descDetail: (info: any) => {
      return (
        <div>
          <span className="variable-right">{info?.__rendererLabel}</span>
          {info?.__rendererName === 'carousel' ? '滚动至下一张' : null}
          {info?.__rendererName === 'wizard' ? '提交当前步骤数据' : null}
        </div>
      );
    }
  },
  collapse: {
    descDetail: (info: any) => {
      return (
        <div>
          <span className="variable-right">{info?.__rendererLabel}</span>
          收起
        </div>
      );
    }
  },
  selectAll: {
    descDetail: (info: any) => {
      return (
        <div>
          <span className="variable-right">{info?.__rendererLabel}</span>
          选中所有选项
        </div>
      );
    }
  },
  focus: {
    descDetail: (info: any) => {
      return (
        <div>
          <span className="variable-right">{info?.__rendererLabel}</span>
          获取焦点
        </div>
      );
    }
  },
  refresh: {
    descDetail: (info: any) => <div>刷新页面</div>
  },
  alert: {
    descDetail: (info: any) => <div>打开提示对话框</div>
  },
  confirm: {
    descDetail: (info: any) => <div>打开确认对话框</div>
  }
};

// 获取动作树中指定的动作
export const findActionNode = (
  actions: RendererPluginAction[],
  actionType: string
) => findTree(actions, node => node.actionType === actionType);

// 获取包含指定子动作的动作
export const findSubActionNode = (
  actions: RendererPluginAction[],
  actionType: string
) =>
  findTree(actions, node =>
    node.actions?.find(
      (item: SubRendererPluginAction) => item.actionType === actionType
    )
  );

// 获取真实的动作类型
export const getActionType = (
  action: ActionConfig,
  hasSubActionNode: RendererPluginAction | null
) =>
  action.__isCmptAction
    ? 'component'
    : hasSubActionNode
    ? hasSubActionNode.actionType
    : action.actionType;

// 获取事件Label文案
export const getEventLabel = (events: RendererPluginEvent[], name: string) =>
  events.find(item => item.eventName === name)?.eventLabel;

// 获取事件描述文案
export const getEventDesc = (events: RendererPluginEvent[], name: string) =>
  events.find(item => item.eventName === name)?.description;

// 判断插件动作中是否存在指定动作
export const hasActionType = (
  actionType: string,
  actions?: RendererPluginAction[]
) => {
  if (!Array.isArray(actions)) {
    return false;
  }
  return !!actions?.find(item =>
    [item.actionType, 'component'].includes(actionType)
  );
};

// 获取动作配置，主要是为了获取config和desc，schema强制捆绑在动作树节点（动作配置可能在插件动作中 > 树节点 or 子动作）
export const getPropOfAcion = (
  action: ActionConfig,
  propName: string,
  actionTree: RendererPluginAction[],
  pluginActions: PluginActions,
  commonActions?: {[propName: string]: RendererPluginAction}
): any => {
  let prop: any = null;
  if (action.componentId) {
    // 优先从组件特性动作中找
    pluginActions[action.__rendererName]?.find(
      (item: RendererPluginAction) => item.actionType === action.actionType
    )?.[propName as keyof RendererPluginAction];
  }

  if (!prop) {
    prop = findActionNode(actionTree, action.actionType)?.[
      propName as keyof RendererPluginAction
    ];
  }

  if (!prop) {
    const commonActionConfig = {
      ...COMMON_ACTION_SCHEMA_MAP,
      ...commonActions
    };
    const hasSubActionNode = findSubActionNode(actionTree, action.actionType);

    if (propName === 'actionLabel') {
      prop = hasSubActionNode?.actionLabel;
    } else {
      prop =
        hasSubActionNode?.actions?.find(
          (item: SubRendererPluginAction) =>
            item.actionType === action.actionType
        )?.[propName as keyof SubRendererPluginAction] ??
        commonActionConfig[action.actionType]?.[
          propName as keyof RendererPluginAction
        ];
    }
  }

  return prop;
};

// 渲染组件选择配置项
export const renderCmptSelect = (
  componentLabel: string,
  required: boolean,
  onChange?: (value: string, oldVal: any, data: any, form: any) => void
) => {
  return [
    {
      type: 'tree-select',
      name: 'componentId',
      label: componentLabel,
      showIcon: false,
      searchable: true,
      required,
      selfDisabledAffectChildren: false,
      size: 'lg',
      source: '${__cmptTreeSource}',
      mode: 'horizontal',
      autoFill: {
        __rendererLabel: '${label}',
        __rendererName: '${type}',
        __nodeId: '${id}',
        __nodeSchema: '${schema}'
      },
      onChange: async (value: string, oldVal: any, data: any, form: any) => {
        onChange?.(value, oldVal, data, form);
      }
    }
  ];
};

// 渲染组件特性动作配置项
export const renderCmptActionSelect = (
  componentLabel: string,
  required: boolean,
  onChange?: (value: string, oldVal: any, data: any, form: any) => void
) => {
  return [
    ...renderCmptSelect(
      '选择组件',
      true,
      async (value: string, oldVal: any, data: any, form: any) => {
        // 获取组件上下文
        if (form.data.__nodeId) {
          const dataSchema: any = await form.data.getContextSchemas?.(
            form.data.__nodeId,
            true
          );
          const dataSchemaIns = new DataSchema(dataSchema || []);
          const variables = dataSchemaIns?.getDataPropsAsOptions() || [];

          form.setValueByName('__cmptDataSchema', dataSchema);
          form.setValueByName('__cmptVariables', variables); // 组件上下文（不含父级）
          form.setValueByName('__cmptVariablesWithSys', [
            // 组件上下文+页面+系统
            {
              label: `${form.data.__rendererLabel}变量`,
              children: variables
            },
            ...form.data.rawVariables.filter((item: ContextVariables) =>
              ['页面变量', '系统变量'].includes(item.label)
            )
          ]);
        }

        if (form.data.actionType === 'setValue') {
          // todo:这里会闪一下，需要从amis查下问题
          form.setValueByName('args.value', undefined);
          form.setValueByName('args.valueInput', undefined);
        }
        form.setValueByName('__cmptActionType', '');

        onChange?.(value, oldVal, data, form);
      }
    ),
    {
      asFormItem: true,
      label: '组件动作',
      name: '__cmptActionType',
      mode: 'horizontal',
      required: true,
      visibleOn: 'data.actionType === "component"',
      component: CmptActionSelect,
      description: '${__cmptActionDesc}'
    }
  ];
};

export const getOldActionSchema = (
  manager: EditorManager,
  context: BaseEventContext
) => {
  const isInDialog = /(?:\/|^)dialog\/.+$/.test(context.path);
  return {
    type: 'button',
    label: '配置动作(旧版)',
    className: 'block old-action-btn',
    tooltip:
      '温馨提示：添加下方事件动作后，下方事件动作将先于旧版动作执行，建议统一迁移至事件动作机制，帮助您实现更灵活的交互设计',
    tooltipPlacement: 'left',
    actionType: 'dialog',
    dialog: {
      type: 'dialog',
      title: '动作',
      body: {
        type: 'form',
        body: [
          {
            label: '按钮行为',
            type: 'select',
            name: 'actionType',
            pipeIn: defaultValue(''),
            options: [
              {
                label: '默认',
                value: ''
              },
              {
                label: '弹框',
                value: 'dialog'
              },

              {
                label: '抽出式弹框（Drawer）',
                value: 'drawer'
              },

              {
                label: '发送请求',
                value: 'ajax'
              },

              {
                label: '下载文件',
                value: 'download'
              },

              {
                label: '页面跳转(单页模式)',
                value: 'link'
              },

              {
                label: '页面跳转',
                value: 'url'
              },

              {
                label: '刷新目标',
                value: 'reload'
              },

              {
                label: '复制内容',
                value: 'copy'
              },

              {
                label: '提交',
                value: 'submit'
              },

              {
                label: '重置',
                value: 'reset'
              },

              {
                label: '重置并提交',
                value: 'reset-and-submit'
              },

              {
                label: '确认',
                value: 'confirm'
              },

              {
                label: '取消',
                value: 'cancel'
              },

              {
                label: '跳转下一条',
                value: 'next'
              },

              {
                label: '跳转上一条',
                value: 'prev'
              }
            ]
          },

          {
            type: 'input-text',
            name: 'content',
            visibleOn: 'data.actionType == "copy"',
            label: '复制内容模板'
          },

          {
            type: 'select',
            name: 'copyFormat',
            options: [
              {
                label: '纯文本',
                value: 'text/plain'
              },
              {
                label: '富文本',
                value: 'text/html'
              }
            ],
            visibleOn: 'data.actionType == "copy"',
            label: '复制格式'
          },

          {
            type: 'input-text',
            name: 'target',
            visibleOn: 'data.actionType == "reload"',
            label: '指定刷新目标',
            required: true
          },

          {
            name: 'dialog',
            pipeIn: defaultValue({
              title: '弹框标题',
              body: '<p>对，你刚刚点击了</p>'
            }),
            asFormItem: true,
            children: ({value, onChange, data}: any) =>
              data.actionType === 'dialog' ? (
                <Button
                  size="sm"
                  level="danger"
                  className="m-b"
                  onClick={() =>
                    manager.openSubEditor({
                      title: '配置弹框内容',
                      value: {type: 'dialog', ...value},
                      onChange: value => onChange(value)
                    })
                  }
                  block
                >
                  配置弹框内容
                </Button>
              ) : null
          },

          {
            visibleOn: 'data.actionType == "drawer"',
            name: 'drawer',
            pipeIn: defaultValue({
              title: '弹框标题',
              body: '<p>对，你刚刚点击了</p>'
            }),
            asFormItem: true,
            children: ({value, onChange, data}: any) =>
              data.actionType == 'drawer' ? (
                <Button
                  size="sm"
                  level="danger"
                  className="m-b"
                  onClick={() =>
                    manager.openSubEditor({
                      title: '配置抽出式弹框内容',
                      value: {type: 'drawer', ...value},
                      onChange: value => onChange(value)
                    })
                  }
                  block
                >
                  配置抽出式弹框内容
                </Button>
              ) : null
          },

          getSchemaTpl('api', {
            label: '目标API',
            visibleOn: 'data.actionType == "ajax"'
          }),

          {
            name: 'feedback',
            pipeIn: defaultValue({
              title: '弹框标题',
              body: '<p>内容</p>'
            }),
            asFormItem: true,
            children: ({onChange, value, data}: any) =>
              data.actionType == 'ajax' ? (
                <div className="m-b">
                  <Button
                    size="sm"
                    level={value ? 'danger' : 'info'}
                    onClick={() =>
                      manager.openSubEditor({
                        title: '配置反馈弹框详情',
                        value: {type: 'dialog', ...value},
                        onChange: value => onChange(value)
                      })
                    }
                  >
                    配置反馈弹框内容
                  </Button>

                  {value ? (
                    <Button
                      size="sm"
                      level="link"
                      className="m-l"
                      onClick={() => onChange('')}
                    >
                      清空设置
                    </Button>
                  ) : null}
                </div>
              ) : null
          },

          {
            name: 'feedback.visibleOn',
            label: '是否弹出表达式',
            type: 'input-text',
            visibleOn: 'this.feedback',
            autoComplete: false,
            description: '请使用 JS 表达式如：`this.xxx == 1`'
          },

          {
            name: 'feedback.skipRestOnCancel',
            label: '弹框取消是否中断后续操作',
            type: 'switch',
            mode: 'inline',
            className: 'block',
            visibleOn: 'this.feedback'
          },

          {
            name: 'feedback.skipRestOnConfirm',
            label: '弹框确认是否中断后续操作',
            type: 'switch',
            mode: 'inline',
            className: 'block',
            visibleOn: 'this.feedback'
          },

          {
            type: 'input-text',
            label: '目标地址',
            name: 'link',
            visibleOn: 'data.actionType == "link"'
          },

          {
            type: 'input-text',
            label: '目标地址',
            name: 'url',
            visibleOn: 'data.actionType == "url"',
            placeholder: 'http://'
          },

          {
            type: 'switch',
            name: 'blank',
            visibleOn: 'data.actionType == "url"',
            mode: 'inline',
            className: 'w-full',
            label: '是否用新窗口打开',
            pipeIn: defaultValue(true)
          },

          isInDialog
            ? {
                visibleOn:
                  'data.actionType == "submit" || data.type == "submit"',
                name: 'close',
                type: 'switch',
                mode: 'inline',
                className: 'w-full',
                pipeIn: defaultValue(true),
                label: '是否关闭当前弹框'
              }
            : {},

          {
            name: 'confirmText',
            type: 'textarea',
            label: '确认文案',
            description: '点击后会弹出此内容，等用户确认后才进行相应的操作。'
          },

          {
            type: 'input-text',
            name: 'reload',
            label: '刷新目标组件',
            visibleOn: 'data.actionType != "link" && data.actionType != "url"',
            description:
              '当前动作完成后，指定目标组件刷新。支持传递数据如：<code>xxx?a=\\${a}&b=\\${b}</code>，多个目标请用英文逗号隔开。'
          },

          {
            type: 'input-text',
            name: 'target',
            visibleOn: 'data.actionType != "reload"',
            label: '指定响应组件',
            description:
              '指定动作执行者，默认为当前组件所在的功能性性组件，如果指定则转交给目标组件来处理。'
          },

          {
            type: 'js-editor',
            allowFullscreen: true,
            name: 'onClick',
            label: '自定义点击事件',
            description: '将会传递 event 和 props 两个参数'
          },

          {
            type: 'input-text',
            name: 'hotKey',
            label: '键盘快捷键'
          }
        ]
      },
      onConfirm: (values: any[]) => {
        manager.panelChangeValue(values[0]);
      }
    }
  };
};
