import { computed, reactive, ref } from "vue";
import axios from "../utils/axios";

export const usePropertyComment = () => {
  const propertyComment = reactive({
    visible: false,
    property_id: null,
    user_id: -100,
    location_score: 0,
    investment_value_score: 0,
    property_facility_score: 0,
    property_indoor_score: 0,
    personal_score: 0,
    remark: "",
    isEdit: false,
    user: {
        user_name: ''
    },
    id: -1,
  });

  const allComment = ref<Array<typeof propertyComment>>([]);

  const comment = reactive({
    visible: false,
    content: "",
    id: 0,
  });

  const commentContent = computed(() => {
    return allComment.value.filter((c) => c.property_id === comment.id);
  });

  const getAllComment = () => {
    return axios
      .get("/propertyComment")
      .then((res) => {
        allComment.value = res.data.data;
        return res.data.data
      });
  };

  const resetpropertyComment = () => {
    propertyComment.property_id = null;
    propertyComment.location_score = 0;
    propertyComment.investment_value_score = 0;
    propertyComment.property_facility_score = 0;
    propertyComment.property_indoor_score = 0;
    propertyComment.personal_score = 0;
    propertyComment.remark = "";
    propertyComment.isEdit = false;
  };

  return {
    propertyComment,
    allComment,
    comment,
    commentContent,
    getAllComment,
    resetpropertyComment
  }
};

export const useProperty = () => {
  return {
  }
}
