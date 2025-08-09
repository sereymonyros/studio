
export type Language = 'en' | 'km';

export const translations = {
  en: {
    header: {
      title: "Arizona Adventure Planner",
      description: "Your personal guide to the Grand Canyon State.",
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
          label: "Website",
          placeholder: "e.g., https://example.com"
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
      text: "Happy travels in sunny Arizona!"
    }
  },
  km: {
    header: {
      title: "អ្នករៀបចំផែនការផ្សងព្រេងអារីហ្សូណា",
      description: "មគ្គុទ្ទេសក៍ផ្ទាល់ខ្លួនរបស់អ្នកទៅកាន់រដ្ឋ Grand Canyon ។",
      toggleLang: "ប្តូរទៅភាសាអង់គ្លេស"
    },
    calendar: {
      title: "កាលវិភាគ​ធ្វើ​ដំណើរ",
      loading: "កំពុងផ្ទុក...",
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
          placeholder: "ឧទាហរណ៍, ឡើងភ្នំ Camelback"
        },
        address: {
          label: "អាស័យដ្ឋាន",
          placeholder: "ឧទាហរណ៍, 123 Main St, Sedona, AZ"
        },
        website: {
          label: "គេហទំព័រ",
          placeholder: "ឧទាហរណ៍, https://example.com"
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
      text: "រីករាយដំណើរកម្សាន្តនៅអារីហ្សូណាដែលមានពន្លឺថ្ងៃ!"
    }
  }
};

export type Translation = typeof translations.en;
