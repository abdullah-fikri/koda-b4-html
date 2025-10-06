define(["jquery", "app/tasks"], function ($, tasksModule) {
  let popupTerbuka = null;

  function tutupPopup() {
    if (popupTerbuka) {
      popupTerbuka.remove();
      popupTerbuka = null;
    }
  }

  function buatPopup(tombolOption, indexTask) {
    tutupPopup();
    let posisiTombol = tombolOption.offset();

    let htmlPopup = `
      <div class="popup-dinamis fixed bg-white border border-[#CCCED2] rounded-lg p-5 shadow-lg z-50" 
           style="top: ${posisiTombol.top + 30}px; left: ${
      posisiTombol.left - 100
    }px;">
        <div class="menu-rename flex items-center cursor-pointer hover:bg-gray-50 p-2 rounded transition-colors">
          <img src="/assets/Edit.png" alt="Icon edit" class="w-4 h-4">
          <span class="ml-3 font-normal text-base text-[#293038]">Rename task</span>
        </div>
        <div class="menu-delete flex items-center cursor-pointer hover:bg-gray-50 p-2 rounded mt-3 transition-colors">
        <img src="/assets/Delete.png" alt="Icon delete" class="w-4 h-4">
        <span class="ml-3 font-normal text-base text-[#293038]">Delete task</span>
      </div>
    </div>
  `;

    $("body").append(htmlPopup);
    popupTerbuka = $(".popup-dinamis");
    popupTerbuka.attr("data-index", indexTask);
  }

  function init() {
    $("#taskCheckbox").on("click", ".option-btn", function (e) {
      e.stopPropagation();
      let indexTask = $(this).data("index");
      buatPopup($(this), indexTask);
    });

    $(document).on("click", function (e) {
      if (
        popupTerbuka &&
        !$(e.target).closest(".popup-dinamis").length &&
        !$(e.target).closest(".option-btn").length
      ) {
        tutupPopup();
      }
    });

    $(document).on("click", ".menu-rename", function () {
      let indexTask = popupTerbuka.attr("data-index");
      let namaBaru = prompt("Masukkan nama tugas baru:");
      if (namaBaru && namaBaru.trim()) {
        let dataTasks = tasksModule.getTasks();
        dataTasks[indexTask].namaTugas = namaBaru.trim();
        localStorage.setItem("user", JSON.stringify(dataTasks));
        tasksModule.init();
        alert("Nama tugas berhasil diubah!");
      }
      tutupPopup();
    });

    $(document).on("click", ".menu-delete", function () {
      let indexTask = popupTerbuka.attr("data-index");
      if (confirm("Yakin ingin menghapus tugas ini?")) {
        let dataTasks = tasksModule.getTasks();
        dataTasks.splice(indexTask, 1);
        localStorage.setItem("user", JSON.stringify(dataTasks));
        tasksModule.init();
        alert("Tugas berhasil dihapus!");
      }
      tutupPopup();
    });
  }

  return { init };
});
