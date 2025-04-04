function setupProfilePage() {
    const selectBox = document.getElementById('my-profile-page-interestsSelect');
    const optionsContainer = document.getElementById('my-profile-page-interestsOptions');
    if (!selectBox || !optionsContainer) return; // Wait until elements exist

    const options = document.querySelectorAll('.my-profile-page-option');
    const selectedTagsContainer = document.getElementById('my-profile-page-selectedTags');
    const hiddenInput = document.getElementById('my-profile-page-interests');
    const saveButton = document.querySelector('button[type="submit"]');

    let selectedInterests = [];

    // 切换下拉框显示/隐藏
    selectBox.addEventListener('click', function() {
        optionsContainer.classList.toggle('show');
    });

    // 点击选项
    options.forEach(option => {
        option.addEventListener('click', function() {
            const value = this.getAttribute('data-value');

            if (selectedInterests.includes(value)) {
                // 如果已选中，则取消选择
                selectedInterests = selectedInterests.filter(item => item !== value);
                this.classList.remove('selected');
            } else {
                // 如果未选中，则添加
                selectedInterests.push(value);
                this.classList.add('selected');
            }

            updateSelectedTags();
            updateHiddenInput();
        });
    });

    // 点击文档其他位置关闭下拉框
    document.addEventListener('click', function(e) {
        if (!selectBox.contains(e.target) && !optionsContainer.contains(e.target)) {
            optionsContainer.classList.remove('show');
        }
    });

    // 更新显示的标签
    function updateSelectedTags() {
        selectedTagsContainer.innerHTML = '';

        if (selectedInterests.length === 0) {
            selectedTagsContainer.innerHTML = '<span style="color: #999;">Select interests...</span>';
            return;
        }

        selectedInterests.forEach(interest => {
            const tag = document.createElement('span');
            tag.className = 'tag';
            tag.innerHTML = `${interest}<span class="tag-remove" data-value="${interest}">×</span>`;
            selectedTagsContainer.appendChild(tag);
        });

        // 添加删除标签的事件
        document.querySelectorAll('.tag-remove').forEach(removeBtn => {
            removeBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                const value = this.getAttribute('data-value');
                selectedInterests = selectedInterests.filter(item => item !== value);

                // 更新选项状态
                options.forEach(option => {
                    if (option.getAttribute('data-value') === value) {
                        option.classList.remove('selected');
                    }
                });

                updateSelectedTags();
                updateHiddenInput();
            });
        });
    }

    // 更新隐藏的输入值
    function updateHiddenInput() {
        hiddenInput.value = selectedInterests.join(',');
    }

    // 保存按钮点击事件
    saveButton.addEventListener('click', function(e) {
        e.preventDefault(); // 阻止表单默认提交行为

        // 获取编辑表单中的值
        const name = document.getElementById('my-profile-page-name').value;
        const email = document.getElementById('my-profile-page-email').value;
        const phone = document.getElementById('my-profile-page-phone').value;
        const gradYear = document.getElementById('my-profile-page-grad_year').value;
        const contact = document.getElementById('my-profile-page-contact').value;

        // 更新Profile Summary
        document.getElementById('summary-name').textContent = name || 'X';
        document.getElementById('summary-email').textContent = email || 'X@example.com';
        document.getElementById('summary-phone').textContent = phone || '123';
        document.getElementById('summary-grad-year').textContent = gradYear || '202X';
        document.getElementById('summary-contact').textContent = contact || 'None';

        // 更新兴趣
        document.getElementById('summary-interests').textContent = selectedInterests.length > 0
            ? selectedInterests.join(', ')
            : 'None';

        // 可以添加保存成功的提示
        alert('Profile updated successfully!');
    });

    // 初始化
    updateSelectedTags();
}
