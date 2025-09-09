import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const QuickActions = () => {
  const quickActions = [
    {
      id: 1,
      title: "Качи нови снимки",
      description: "Добави нови работи в портфолиото",
      icon: "Upload",
      color: "bg-accent",
      action: "upload"
    },
    {
      id: 2,
      title: "Създай галерия за клиент",
      description: "Подготви галерия за доставка",
      icon: "FolderPlus",
      color: "bg-secondary",
      action: "create_gallery"
    },
    {
      id: 3,
      title: "Блокирай дати",
      description: "Маркирай недостъпни периоди",
      icon: "CalendarX",
      color: "bg-surface-elevation",
      action: "block_dates"
    },
    {
      id: 4,
      title: "Изпрати съобщение",
      description: "Комуникирай с клиенти",
      icon: "Send",
      color: "bg-warm-section",
      action: "send_message"
    },
    {
      id: 5,
      title: "Актуализирай цени",
      description: "Промени пакети и цени",
      icon: "DollarSign",
      color: "bg-accent",
      action: "update_pricing"
    },
    {
      id: 6,
      title: "Генерирай отчет",
      description: "Създай финансов отчет",
      icon: "BarChart3",
      color: "bg-secondary",
      action: "generate_report"
    }
  ];

  const handleAction = (action) => {
    console.log(`Executing action: ${action}`);
    // Here you would implement the actual action logic
  };

  return (
    <div className="bg-background rounded-lg shadow-soft border border-border">
      <div className="px-6 py-4 border-b border-border">
        <h3 className="text-lg font-heading font-semibold text-sophisticated-dark">
          Бързи действия
        </h3>
        <p className="text-sm text-hierarchy-secondary mt-1">
          Често използвани функции за управление на бизнеса
        </p>
      </div>
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {quickActions?.map((action) => (
            <div
              key={action?.id}
              className={`${action?.color} rounded-lg p-4 elegant-hover cursor-pointer transition-all duration-300`}
              onClick={() => handleAction(action?.action)}
            >
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                    <Icon name={action?.icon} size={20} className="text-sophisticated-dark" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium text-sophisticated-dark font-sophisticated">
                    {action?.title}
                  </h4>
                  <p className="text-xs text-hierarchy-secondary mt-1">
                    {action?.description}
                  </p>
                </div>
                <div className="flex-shrink-0">
                  <Icon name="ChevronRight" size={16} className="text-hierarchy-secondary" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="px-6 py-4 border-t border-border bg-surface-elevation rounded-b-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Icon name="Zap" size={16} className="text-hierarchy-secondary" />
            <span className="text-sm text-hierarchy-secondary">
              Персонализирай бързите действия
            </span>
          </div>
          <Button variant="ghost" size="sm">
            <Icon name="Settings" size={16} />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default QuickActions;