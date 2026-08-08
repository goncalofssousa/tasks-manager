import { ref, computed } from 'vue'
import { useTagsStore } from '../stores/tags'

const MAX_TAGS = 3

export function useTagSelector(initialTags: string[] = []) {
  const tagsStore = useTagsStore()

  const selectedTags = ref<string[]>([...initialTags])
  const showTagDropdown = ref(false)

  const availableTags = computed(() =>
    Object.values(tagsStore.tags).filter(tag => !selectedTags.value.includes(tag.key))
  )

  const canAdd = computed(() => selectedTags.value.length < MAX_TAGS)

  function toggleTag(key: string) {
    const index = selectedTags.value.indexOf(key)
    if (index === -1) selectedTags.value.push(key)
    else selectedTags.value.splice(index, 1)

    if (selectedTags.value.length >= MAX_TAGS) {
      showTagDropdown.value = false
    }
  }

  function reset(tags: string[] = []) {
    selectedTags.value = [...tags]
    showTagDropdown.value = false
  }

  return {
    selectedTags,
    showTagDropdown,
    availableTags,
    canAdd,
    toggleTag,
    reset
  }
}