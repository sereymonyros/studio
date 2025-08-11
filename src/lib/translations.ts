
export type Language = 'en' | 'km';

export const translations = {
  en: {
    header: {
      title: "Arizona Trip",
      description: "",
      toggleLang: "Switch to Khmer"
    },
    calendar: {
      title: "Trip Itinerary",
      loading: "Loading itinerary...",
    },
    suggestions: {
      title: "AI-Powered Suggestions"
    },
    form: {
      addTitle: "Add Activity on",
      editTitle: "Edit Activity",
      fields: {
        title: {
          label: "Title",
          placeholder: "e.g., Hike Camelback Mountain"
        },
        address: {
          label: "Address",
          placeholder: "e.g., 123 Main St, Sedona, AZ"
        },
        website: {
          label: "Website URL",
          placeholder: "e.g., https://example.com"
        },
        websiteText: {
          label: "Website Label",
          placeholder: "e.g., Official Website"
        },
        date: {
          label: "Date",
          placeholder: "Pick a date"
        },
        time: {
          label: "Time"
        },
        imageUrls: {
            label: "Image URLs (one per line)",
            placeholder: "Enter image URLs, one per line"
        },
        code: {
          label: "Code",
          placeholder: "Enter any relevant codes (e.g., confirmation, door code)"
        }
      },
      buttons: {
        add: "Add to Itinerary",
        save: "Save Changes",
        cancel: "Cancel",
        edit: "Edit",
        delete: "Delete"
      }
    },
    toasts: {
        dbErrorTitle: "Database Error",
        dbErrorLoad: "Could not load itinerary. Please try again later.",
        dbErrorSave: "Could not save the new activity.",
        dbErrorUpdate: "Could not update the activity.",
        dbErrorDelete: "Could not delete the activity."
    },
    footer: {
      text: "@RSM"
    }
  },
  km: {
    header: {
      title: "ដំណើរ​កម្សាន្ត​នៅ​អារីហ្សូណា",
      description: "",
      toggleLang: "ប្តូរទៅភាសាអង់គ្លេស"
    },
    calendar: {
      title: "កាលវិភាគ​ធ្វើ​ដំណើរ",
      loading: "កំពុងផ្ទុកកាលវិភាគ...",
    },
    suggestions: {
      title: "ការណែនាំដោយ AI"
    },
    form: {
      addTitle: "បន្ថែមសកម្មភាពនៅលើ",
      editTitle: "កែសម្រួលសកម្មភាព",
      fields: {
        title: {
          label: "ចំណងជើង",
          placeholder: "ឧ. ឡើងភ្នំ Camelback"
        },
        address: {
          label: "អាសយដ្ឋាន",
          placeholder: "ឧ. 123 Main St, Sedona, AZ"
        },
        website: {
          label: "URL គេហទំព័រ",
          placeholder: "ឧ. https://example.com"
        },
        websiteText: {
            label: "ស្លាកគេហទំព័រ",
            placeholder: "ឧ. គេហទំព័រផ្លូវការ"
        },
        date: {
          label: "កាលបរិច្ឆេទ",
          placeholder: "ជ្រើសរើសកាលបរិច្ឆេទ"
        },
        time: {
          label: "ពេលវេលា"
        },
        imageUrls: {
            label: "URL រូបភាព (មួយក្នុងមួយបន្ទាត់)",
            placeholder: "បញ្ចូល URL រូបភាព, មួយក្នុងមួយបន្ទាត់"
        },
        code: {
          label: "កូដ",
          placeholder: "បញ្ចូល​លេខ​កូដ​ដែល​ពាក់ព័ន្ធ (ឧ. លេខ​កូដ​បញ្ជាក់, លេខ​កូដ​ទ្វារ)"
        }
      },
      buttons: {
        add: "បន្ថែមទៅកាលវិភាគ",
        save: "រក្សាទុកការផ្លាស់ប្តូរ",
        cancel: "បោះបង់",
        edit: "កែសម្រួល",
        delete: "លុប"
      }
    },
    toasts: {
        dbErrorTitle: "បញ្ហាមូលដ្ឋានទិន្នន័យ",
        dbErrorLoad: "មិនអាចផ្ទុកកាលវិភាគបានទេ។ សូមព្យាយាមម្តងទៀតនៅពេលក្រោយ។",
        dbErrorSave: "មិនអាចរក្សាទុកសកម្មភាពថ្មីបានទេ។",
        dbErrorUpdate: "មិនអាចធ្វើបច្ចុប្បន្នភាពសកម្មភាពបានទេ។",
        dbErrorDelete: "មិនអាចលុបសកម្មភាពបានទេ។"
    },
    footer: {
      text: "@RSM"
    }
  }
};

export type Translation = typeof translations.en;
